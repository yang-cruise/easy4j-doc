# 服务端

## 简介
以下内容介绍 `easy4j` 提供的一些基础功能，它们可以大大减少代码量，并提升开发效率。

## 自动创建数据表





## 统一响应封装

为保持接口响应的统一性， `easy4j` 所有接口响应使用统一格式，并利用 `spring` 提供的 `@RestControllerAdvice` 实现了统一响应封装功能，让代码变得更加简洁，你只需关注业务，在接口响应之前会自动进行统一包装。

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

## 全局异常处理

框架利用 `spring` 提供的 `@RestControllerAdvice` 进行全局异常处理，所有异常将会被捕获，并按统一格式响应。详情可查看 `cn.easy4j.framework.exception.GlobalExceptionHandler` 

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

## 防止重复提交

此功能通过在 `Controller` 的方法上添加 `@CheckRepeatSubmit` 注解实现防重复提交功能，可防止6秒内提交相同的请求，此功能通常在新增方法上使用，防止用户误操作多次连续点击提交按钮。

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