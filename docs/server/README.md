# 服务端

## 简介
`Easy4J` 服务端是在 `Spring Boot 2.x` 基础上开发的脚手架，项目已上传至中央仓库。我们严格遵守 [《Java开发手册》](https://yq.aliyun.com/articles/756359?spm=a2c4e.11163080.searchblog.16.32fb2ec14h1tve) 的编码规范，代码简洁易读。

```javascript
|- easy4j-parent
    |- easy4j-common  // 公共模块，存放公共常量、异常、枚举等。
    |- easy4j-spring-boot-starter  // 核心模块，提供基础功能
    |- easy4j-admin-spring-boot-starter  // 后台管理模块，是easy4j-admin-ui前端项目的服务端
    |- easy4j-dict-spring-boot-starter  // 数据字典模块
    |- easy4j-oss-spring-boot-starter  // 文件存储模块
```



## easy4j - 核心模块

此模块为 `Easy4J` 核心模块，默认集成了 `spring-boot` `mybatis-plus` `caffeine` 等第三方库，提供了一些常用的特色功能，它们可以大大减少代码量，并提升开发效率。

```xml
<dependency>
    <groupId>cn.easy4j</groupId>
    <artifactId>easy4j-spring-boot-starter</artifactId>
    <version>${easy4j.version}</version>
</dependency>
```



### 自动创建数据表
`Easy4J` 实现了自动创建表结构的功能，所有当你引用 `easy4j-admin-spring-boot-starter` 等模块后，框架会自动创建所需要的表结构及初始数据，省去手动执行SQL脚本的麻烦。详情可查看源码 [DbInitializerListener.java](https://github.com/yang-cruise/easy4j/blob/master/easy4j-parent/easy4j-spring-boot-starter/src/main/java/cn/easy4j/framework/db/DbInitializerListener.java)



### 统一响应封装
为保持接口响应的统一性， `Easy4J` 所有接口响应使用统一格式，并利用 `spring` 提供的 `@RestControllerAdvice` 实现了统一响应封装功能，让代码变得更加简洁，你只需关注业务，在接口响应之前会自动进行统一包装。详情可查看源码 [ResultWrapperResponseBodyAdvice.java](https://github.com/yang-cruise/easy4j/blob/master/easy4j-parent/easy4j-spring-boot-starter/src/main/java/cn/easy4j/framework/interceptor/ResultWrapperResponseBodyAdvice.java)

> 如果你的接口不希望在响应时加上默认的 `cn.easy4j.common.response.Result` 类包装，可在 `Controller`的方法上添加注解 `@IgnoreResultWrapper` 

```java
// 自动封装统一格式响应
@GetMapping
public SysUserVO auto() {
	return new SysUserVO();
}

// 手动使用 Result 响应
@GetMapping
public Result<SysUserVO> manual() {
	return new SuccessResult<>(new SysUserVO());
}

// 不要统一封装
@IgnoreResultWrapper
@GetMapping
public SysUserVO ignore() {
	return new SysUserVO();
}
```

```java
// 统一响应格式示例
{
	"success": true,
	"code": 200,
	"msg": "请求成功",
	"data": {
		"id":31,
		"account":"admin"
	}
}

// 添加 @IgnoreResultWrapper 注解的响应示例
{
	"id":31,
	"account":"admin"
}
```



### 全局异常处理

框架利用 `spring` 提供的 `@RestControllerAdvice` 进行全局异常处理，所有异常将会被捕获，并按统一格式响应。详情可查看源码 [GlobalExceptionHandler.java](https://github.com/yang-cruise/easy4j/blob/master/easy4j-parent/easy4j-spring-boot-starter/src/main/java/cn/easy4j/framework/exception/GlobalExceptionHandler.java)

> 业务层可抛出框架提供的自定义异常 `cn.easy4j.common.exception.BusinessException` ，异常会被框架捕获，并按统一格式响应。
>
> 为简化代码，也可使用 `spring` 提供的断言工具类 `org.springframework.util.Assert` ，抛出异常一样会被框架捕获。

```java
public void checkUser(Long userId) {
	Assert.notNull(userId, "用户ID不能为空");
	if (userId == 0L) {
		throw new BusinessException("用户ID错误");
	}
}
```



### 数据权限控制

框架通过拦截 `MyBatis` 的拦截机制实现数据权限控制，详情可查看源码 [DataScopeInterceptor.java]( https://github.com/yang-cruise/easy4j/blob/master/easy4j-parent/easy4j-spring-boot-starter/src/main/java/cn/easy4j/framework/datascope/DataScopeInterceptor.java) 

> 在企业管理系统中，常常有这样的需求：
>
> - 登录用户一般只能查看自己部门的数据 
>
> - 可以设置用户可以查看哪些部门的数据
>
> 这种权限的控制，一般称为数据权限控制。

```java
Set<Long> deptIds = sysDeptService.querySubDept(SecurityUtil.getLoginUser().getDeptId(), new HashSet<>());
return sysUserService.list(dto, new DataScope(deptIds));
```



### 防止重复提交

此功能通过在 `Controller` 的方法上添加 `@CheckRepeatSubmit` 注解实现防重复提交功能，可防止6秒内提交相同的请求，此功能通常在新增方法上使用，防止用户误操作多次连续点击提交按钮。详情可查看源码 [CheckRepeatSubmitInterceptor.java](https://github.com/yang-cruise/easy4j/blob/master/easy4j-parent/easy4j-spring-boot-starter/src/main/java/cn/easy4j/framework/interceptor/CheckRepeatSubmitInterceptor.java)

```java
@RestController
@RequestMapping("/sys_users")
public class SysUserController {

    @ApiOperation(value = "新增用户")
    @PostMapping
    @CheckRepeatSubmit
    @PreAuthorize("hasPermission('用户管理', '新增用户', 'sys:user:insert')")
    public Boolean post(@Validated @RequestBody PostSysUserDTO dto) {
        return sysUserService.insertUser(dto);
    }
}
```

> 此功能使用缓存 `caffeine` 实现，如需修改6秒默认值，或使用其他缓存框架，请覆盖 `CacheAutoConfiguration` 类中的Bean `checkRepeatSubmitCache`

```java
@Bean("checkRepeatSubmitCache")
public Cache checkRepeatSubmitCache() {
    return new CaffeineCache(CacheConstant.CHECK_REPEAT_SUBMIT, Caffeine.newBuilder().expireAfterWrite(30L, TimeUnit.SECONDS).build());
}
```

> 此功能默认使用`IP + URI + USER_AGENT` 作为请求的唯一标识，详情可查看 `cn.easy4j.framework.strategy.DefaultCheckRepeatSubmitStrategy` ，如果需要自定义重复请求的校验规则，请覆盖 `cn.easy4j.framework.config.CheckRepeatSubmitAutoConfiguration` 类中的Bean `checkRepeatSubmitStrategy`

```java
@Bean
public CheckRepeatSubmitStrategy checkRepeatSubmitStrategy() {
	return new AdminCheckRepeatSubmitStrategy();
}
```



## easy4j - admin模块

此模块为后台管理系统的服务端，配合前端项目 [easy4j-admin-ui](https://github.com/yang-cruise/easy4j-admin-ui) 可以快速搭建一个包含登录功能、权限控制、数据字典、菜单管理等功能的后台管理系统。

```xml
<dependency>
    <groupId>cn.easy4j</groupId>
    <artifactId>easy4j-admin-spring-boot-starter</artifactId>
    <version>${easy4j.version}</version>
</dependency>
```



### 功能权限控制

此模块采用 `spring-security` 实现功能权限控制。如果你有需要放行的url，不需要被权限拦截，可以在 `application.yml` 按以下方式配置。

```yml
easy4j:
  admin:
    security:
      # 配置需要放行的url
      ignore-urls:
        - /login
        - /logout
```



获取当前登录用户信息。

```java
// 获取当前登录用户
LoginUser loginUser = SecurityUtil.getLoginUser();
// 获取当前用户用户ID
Long LoginUserId = SecurityUtil.getLoginUserId();
```



框架实现了自动录入权限标识到数据库的功能，但在使用 `@PreAuthorize` 注解时必须遵循相关的约定，注意查看项目启动时的日志信息。详情可查看源码 [Easy4jPermissionEvaluator.java](https://gitbub.com/yang-cruise/easy4j/blob/master/easy4j-parent/easy4j-admin-spring-boot-starter/src/main/java/cn/easy4j/admin/core/security/Easy4jPermissionEvaluator.java)

```java
/**
 * 此功能可以自动录入按钮的权限标识，省去在sys_menu表中录入的麻烦，前提条件是必须先存在arg1的菜单目录
 * hasPermission(arg1, arg2, arg3) 中的3个参数顺序必须遵循以下要求
 * arg1 表示菜单目录，对应 sys_menu 表中 type=M 的 name 字段
 * arg2 表示权限名称，对应 sys_menu 表中 type=B 的 name 字段
 * arg3 表示权限标识，对应 sys_menu 表中 type=B 的 perms 字段
 */
@ApiOperation(value = "查询用户详情")
@GetMapping("/{id}")
@PreAuthorize("hasPermission('用户管理', '查询用户', 'sys:user:select')")
public SysUserVO detail(@PathVariable Long id) {
    return sysUserService.selectSysUserById(id);
}
```



### Swagger接口文档

此模块集成了 `Swagger2` 实现接口文档，此功能默认未开启，在开发环境可在配置文件中打开，建议生产环境不要开启。

```yaml
easy4j:
  admin:
    swagger:
      enable: true
      host: 127.0.0.1:6789
```



## easy4j - dict模块

依赖此模块，会自动创建 `sys_dict` 与 `sys_dict_item` 表，用于配置系统常用的数据字典。`easy4j-admin-spring-boot-starter` 模块默认依赖此模块，可进行数据字典管理。

```xml
<dependency>
    <groupId>cn.easy4j</groupId>
    <artifactId>easy4j-dict-spring-boot-starter</artifactId>
    <version>${easy4j.version}</version>
</dependency>
```



### 字典值转文本

在返回给前端的接口中，给属性添加 `@JsonDictConvert` 注解，可以在接口响应序列化时自动将值转换为文本，并在响应的json中增加 `xxxText` 字段。

```xml
<dependency>
    <groupId>cn.easy4j</groupId>
    <artifactId>easy4j-dict-spring-boot-starter</artifactId>
    <version>${easy4j.version}</version>
</dependency>
```



| 参数       | 类型   | 必填 | 说明                                               |
| ---------- | ------ | ---- | -------------------------------------------------- |
| code       | String | 是   | 字典编码，对应sys_dict表中的code字段               |
| fileldName | String | 否   | json序列化时新增的字段名，默认在原字段名后追加Text |

```java
// 响应实体类
public class SysUserVO {
    @JsonDictConvert(code = "sys_user.sex")
    @ApiModelProperty(value = "性别 1男  2女")
    private String sex;
}

// 响应json
{
    "sex": 1,
    "sexText": "男"
}
```



### 查询字典列表

调用 `/sys_dicts/cache/items` 接口，可以根据 `code` 查询字典配置列表，用于前端生成下拉框，可参考前端项目 `easy4j-admin-ui` 中的 `easy4j-dict-select` 组件，快速生成下拉列表。



## easy4j-oss模块

此模块实现文件存储功能，默认存储到本地服务器，也可以支持阿里云OSS。

```xml
<dependency>
    <groupId>cn.easy4j</groupId>
    <artifactId>easy4j-oss-spring-boot-starter</artifactId>
    <version>${easy4j.version}</version>
</dependency>
```



### 默认本地存储

默认本地存储 `local`，未设置 `easy4j.oss.local.path` 时，默认存储路径为：

- 本地开发测试：`{项目根目录}/target/static/upload/`
- 打包发布运行：`{发布jar包目录}/static/upload/`

```yaml
easy4j:
  oss:
    type: local
    local:
      # 修改默认存储路径
      path: E:\\upload
```



### 阿里云OSS存储

使用阿里云OSS存储需要添加相关依赖，框架默认不包含此第三方库。

第一步，添加阿里云OSS依赖。

```xml
<dependency>
    <groupId>com.aliyun.oss</groupId>
    <artifactId>aliyun-sdk-oss</artifactId>
    <version>${aliyun-oss.version}</version>
</dependency>
```



第二步，配置阿里云OSS相关参数。

```yaml
easy4j:
  oss:
    type: aliyun
    aliyun:
      bucket-name: xxx
      enpoint: xxx.aliyuncs.com
      access-key-id: xxx
      access-key-secret: xxx
```



第三步，覆盖默认 `fileStorageStrategy` 实例。

```java
@Bean
public FileStorageStrategy fileStorageStrategy(Easy4jOssProperties easy4jOssProperties) {
     return new AliyunFileStorageStrategy(easy4jOssProperties.getAliyun(), ossClient(easy4jOssProperties));
}
```



