# Easy4j

## 简介
`Easy4j` 是在 `Spring Boot 2.x` 基础上开发的脚手架，我们严格遵守[《Java开发手册》](https://yq.aliyun.com/articles/756359?spm=a2c4e.11163080.searchblog.16.32fb2ec14h1tve)的编码规范，代码简洁易读。

体验后台管理系统请点击：[admin.easy4j.cn](http://admin.easy4j.cn)

## 愿景
我们的愿景是让Java开发更简单，就像项目名称一样：`Easy for Java.`

## 快速开始
以下步骤将带你快速搭建一个 `easy4j` 的项目，当然你也可以直接查看 [示例项目](https://github.com/yang-cruise/easy4j/tree/master/easy4j-sample)

### 1. 初始化工程
创建一个空的 Spring Boot 工程

> 可以使用 [Spring Initializer](https://start.spring.io/) 快速初始化一个 Spring Boot 工程

### 2. 添加依赖
引入 Spring Boot Starter 父工程：

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>${spring-boot.latest.version}</version>
</parent>
```

引入  `easy4j-admin-spring-boot-starter`  依赖：
```xml
<dependency>
    <groupId>cn.easy4j</groupId>
    <artifactId>easy4j-admin-spring-boot-starter</artifactId>
    <version>${easy4j.latest.version}</version>
</dependency>
```

### 3. 创建数据库
在MySQL数据库中创建一个空的 `database`

### 4. 数据源配置
在  `application.yml`  配置文件中添加MySQL数据库的相关配置

```yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/easy4j?useUnicode=true&amp;characterEncoding=utf8&amp;zeroDateTimeBehavior=convertToNull&amp;useSSL=true&amp;serverTimezone=Asia/Shanghai
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### 5. 启动后端
运行 `Spring Boot` 项目启动类

### 6. 启动前端
下载 [easy4j-admin-ui](https://github.com/yang-cruise/easy4j-admin-ui) 项目，运行以下命令
```
npm install
npm run dev
```

### 7. 开始体验
现在可以访问 [本地环境](http://localhost:8080/) 体验 `easy4j` 为你提供的基础功能了
