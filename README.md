# 微信版  

# 设置镜像
npm config set registry "http://registry.npm.taobao.org/"

# 安装
1.下载安装node(v4.4.0版本以上, 建议6.x以上版本)  
```
	npm install -g fis3  						//安装fis3
	npm install -g fis3-hook-module  			//安装模块组件
	npm install -g fis3-deploy-zip				//安装zip压缩包插件
	npm install -g fis3-deploy-skip-packed		//安装过滤已打包插件
	npm install -g fis3-parser-typescript		//安装jsx转换插件	
	npm install -g fis3-deploy-replace  		//安装字符替换插件
	npm install -g fis3-hook-relative 			//安装相对路径插件
	npm install -g fis3-postpackager-loader 	//安装模块化依赖自动加载插件
```

# 升级
```如果是新安装的则不需要升级, 原本就有则需要对一些插件和组件进行升级, 具体如下:```

* 升级内容  
```
 1. 支持差异化打包
 2. 输出目录规范化
 3. 支持打包zip
 4. 过滤冗余打包文件  
```

* 遗留问题    
```
 1. 开发时的目录依然很混乱
 2. 打包zip时不能指定目录
```

* node升级
```	
	直接官网下载v4.4.x, 或者6.x的node安装文件进行安装(install.msi文件)
```

* fis3升级
```
	卸载本地: npm uninstall fis3
	卸载全局: npm uninstall -g fis3
	安装全局: npm install -g fis3
```

* 插件升级
```
	目前只有一款插件需要升级: fis3-postpackager-loader 
	升级的流程和上面fis3一样, 先卸载,然后安装

	卸载: npm uninstall -g fis3-postpackager-loader 
	安装: npm install -g fis3-postpackager-loader 
``` 

# 输出目录调整
``` 之前输出目录太过混乱,而且包含了一些打包过的文件(冗余文件),这次升级对目录进行调整 ```     
```
	static          //静态资源
		js		    //js资源
		css         //css资源
		img 		//图片资源
	pages			//页面资源
	index.html 		/首页
```    

# 目录配置          
```
wechat 				项目名  
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
