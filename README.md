# webchat
钱罐子微信版

#安装
1.下载安装node  
2.安装fis3  npm install -g fis3  
3.安装模块化组件 npm install -g fis3-hook-module  
4.安装模块化依赖自动加载插件 npm install -g fis3-postpackager-loader
5.安装字符替换插件 npm install -g fis3-deploy-replace

#设置镜像
npm config set registry "http://registry.npm.taobao.org/"

#目录配置
```
webchat 				项目名  
	libs				非模块化第三方组件  
	modules				模块化资源  
		libs			第三方组件模块化资源  
		common			公有模块化资源  
		pages			页面级模块资源  	
	views				非模块资源  
		image			图片资源  
		css				样式资源  
		pages			页面资源
```
