# 客户端

## 简介
`Easy4J` 客户端基于 [ant-design-vue-pro](https://pro.antdv.com/) 开发，除 `Easy4J` 自定义封装的组件外，其余请参考 [官方文档](https://pro.antdv.com/components/avatar-list)

## 目录结构
本项目采用文件自动生成路由数据，无需前端再次编写路由文件。所以必须遵循项目中的目录结构。

> 自动化路由，只识别index.vue文件为路由页面

- biz (业务项目代码)
  - assets (静态文件)
  - store (仓库)
  - utils (功能函数)
  - views (业务页面)
    - hello/index.vue (路由路径为文件夹名称：/hello)
    - hello/test/index.vue (/hello/test)
- framework (框架源码)
  - api (框架数据请求)
  - assets (静态文件)
  - components (框架所封装的组件)
  - config (框架配置项)
    - defaultSettings.js (项目默认配置：主题色，主要布局等)
    - router.config.js (前端写入路由文件数据格式：项目默认是根据目录结构生成路由数据。可忽略)
  - core (项目第三方插件代码)
  - directive (自定义指令配置)
  - easy4j  (项目核心业务页面以及业务组件)
  - example (组件使用例子：正式使用可删除)
  - layouts (项目布局)
  - locales (项目语言切换)
  - router (项目路由配置)
  - store (项目仓库)
  - utils (框架功能函数)
  - views (项目基础页面)

## 组件
### easy4j-query-form
搜索表单，通常在查询列表页面中使用

#### API

| 参数       | 说明                       | 类型  | 默认值 |
| ---------- | -------------------------- | ----- | ------ |
| formConfig | 搜索表单配置项，具体见示例 | array | -      |

#### 事件

| 事件名称 | 说明               | 回调参数        |
| -------- | ------------------ | --------------- |
| search   | 点击“搜索”按钮触发 | Function(value) |
| reset    | 点击“重置”按钮触发 |                 |

```vue
<template>
	 <easy4j-query-form :formConfig="formData" @search="search" @reset="reset"></easy4j-query-form>
</template>

<script>
	import Easy4jQueryForm from '@/framework/easy4j/components/easy4j-query-form'
	const formData = [
      {
        label: '角色名称',
        prop: 'roleName',
        placeholder: '请输入角色名称',
        defaultVal: '管理员'
      },
      {
        label: '菜单类型',
        prop: 'menuType',
        placeholder: '请选择菜单类型',
        option: [
        	{
        		value: '角色管理',
        		prop: 'role'
        	},
        	{
        		value: '菜单管理',
        		prop: 'menu'
        	}
        ]
      },
      {
      	label: '状态',
        prop: 'status',
        type: 'select',
        dict: 'user_status',
        placeholder: '请选择状态'
      },
      {
        label: '时间',
        prop: 'time123',
        type: 'timePicker',
        pickerType: 'date' // date:日期, datetime：日期时间,week：周区间,month：月区间,daterange：日期范围,datetimerang：日期时间范围选择
      }
    ]
	
	export default {
		components: {
			Easy4jQueryForm
		},
		methodes: {
			// 搜索
			search (value) {
				console.log(value)
			},
			// 重置
			reset (value) {
				console.log(‘重置表单’)
			}
		}
	}
</script>
```

### easy4j-time-picker
时间组件

#### API

| 参数           | 说明         | 类型                                                         | 默认值     |
| -------------- | ------------ | ------------------------------------------------------------ | ---------- |
| type           | 时间格式     | {String}-类型：date:日期, datetime：日期时间,week：周区间,month：月区间,daterange：日期范围,datetimerang：日期时间范围选择 | date       |
| defaultValue   | 默认值       | [moment](https://momentjs.com/)                              |            |
| value(v-model) | 时间值       | {String， Array} 范围选择为数组字符串格式                    |            |
| label          | 标签         | {String}                                                     |            |
| valueFormat    | 绑定值格式   | {String} - [具体格式](https://momentjs.com/docs/#/displaying/format/) |            |
| format         | 展示值格式   | string \| string[]                                           | YYYY-MM-DD |
| allowClear     | 是否支持清除 | {Boolean}                                                    | true       |
| placeholder    | 默认文本     | {String} value值为"undefined"时显示默认文本                  |            |
| inputReadOnly  | 只可读       | {Boolean}                                                    | false      |
| disabled       | 禁用         | {Boolean}                                                    | fasle      |

#### 事件

| 事件名称 | 说明                                     | 回调参数                                       |
| -------- | ---------------------------------------- | ---------------------------------------------- |
| change   | 时间发生变化的回调，发生在用户选择时间时 | function (date: moment \| string, date:string) |

```vue
<template>
	<easy4j-time-picker v-model="times" type="datetime" @change="onChange"></easy4j-time-picker>
</template>

<script>
	export default {
        data () {
            return {
                times: ''
            }
        },
        methods: {
            onChange (moment, date) {
                console.log(moment, date)
            }
        }
    }
</script>
```

### easy4j-dictionary
数据字典下拉框组件

#### API

| 参数       | 说明                       | 类型  | 默认值 |
| ---------- | -------------------------- | ----- | ------ |
| codeKey| 下拉的请求key，具体见示例 | string| -      |

#### 事件

| 事件名称 | 说明               | 回调参数        |
| -------- | ------------------ | --------------- |
| changeSelect| 选择下拉回调 | Function(Object) |        

```vue
<template>
    <Easy4j-Dictionary :codeKey="codeKey" @changeSelect="changeSelect"></Easy4j-Dictionary>
</template>
<script>
import Easy4jDictionary from '@/framework/easy4j/components/easy4j-dictionary'
export default {
  components: { Easy4jDictionary },
  data () {
    return {
      codeKey: 'sys_menu.type'
    }
  },
  methods: {
    changeSelect (value) {
      console.log(value)
    }
  }
}
</script>
```

### v-permission
指令权限，快速实现按钮级别的权限控制。

```vue
<template>
    <a-button
        v-permission="'user:insert'"
        type="primary"
        icon="plus"
    >
        新增用户
    </a-button>
</template>
```

#### 局限性
在有些情况下，只能通过设置v-if实现权限控制相关，可以使用全局权限判断函数，用法和指令 `v-permission` 类似。
```vue
<template>
    <a-button
        v-if="hasPermission('user:delete')"
        type="primary"
        icon="delete"
    >
        删除用户
    </a-button>
</template>
<scrpit>
    import {
      hasPermission
    } from '@/framework/utils/util'
</script>
```