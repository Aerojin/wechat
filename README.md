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

# fis-conf.js 配置  
```
// npm install [-g] fis3-hook-module
/*
****************基础配置****************
{
    mode: 模块化类型(AMD,CDM, CommandJs)
    baseUrl: 基础路径
    path: 配置别名或者路径
}
*/
fis.hook('module', {
    mode: 'commonJs',
    baseUrl: "./modules/",
    paths: {
      api: "common/api/",
      base: "common/base/",
      kit: "common/kit/",
      ui: "common/ui/",
        zepto: "libs/zepto/zepto",
      artTemplate: "libs/template/template"
	}
});



/****************模块化设置***************/

/*设置模块目录, 打包时自动包裹define*/
fis.match('/modules/**.js', {
    isMod: true
});

/*设置发布时不产出的文件*/
fis.match('**.{tmpl,txt,md,json}', {    
    release: false
});

/*设置发布时不产出的文件(内嵌文件,不产出)*/
fis.match('/libs/base/system.js', {    
    release: false
});

/*设置打包时自动处理模块化依赖关系*/
fis.match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    }),

    /*设置零散资源自动打包*/
    postpackager: fis.plugin('loader', {
      allInOne: {
        js: function (file) {
          return "/static/js/pages/" + file.filename + "_aio.js";
        },
        css: function (file) {
          return "/static/css/" + file.filename + "_aio.css";
        }
      }      
    })
});


/****************打包设置***************/

/*指定文件添加md5戳*/
fis.match('*.{js,css,png,jpg,gif}', {
  useHash: true
});

/*指定文件添加md5戳*/
fis.match('/views/images/icon/*.*', {
  useHash: false
});


/*设置png图片压缩插件*/
fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

/****************合并设置***************/

/*第三方组件合并处理*/
fis.match('modules/libs/**.js', {
  packTo: '/static/js/libs.js'
});

/*系统资源合并处理*/
fis.match('/libs/*.js', {
  packTo: '/static/js/mod.js'
});


/*公共组件合并处理*/

fis.match('modules/common/api/**.js', {
    packTo: '/static/js/common_api.js'
});

fis.match('modules/common/kit/**.js', {
    packTo: '/static/js/common_kit.js'
});

fis.match('modules/common/base/**.js', {
    packTo: '/static/js/common_base.js'
});

fis.match('modules/common/ui/**.js', {
    packTo: '/static/js/common_ui.js'
});

fis.match('modules/pages/**/(*.js)', {
    release: 'static/js/pages/$1'
});


/*样式合并处理*/
fis.match('views/css/**.css', {
    packTo: '/static/css/style.pack.css',
    packOrder: 1
});

fis.match('modules/common/**.css', {
    packTo: '/static/css/common.pack.css',
    packOrder: 0
});

fis.match('modules/pages/**/(*.css)', {
    release: '/static/css/$1'
});

/*图片输出处理*/
fis.match('views/**/(*.{png,jpg,gif})', {
    release: '/static/img/$1'
});

fis.match('modules/**/(*.{png,jpg,gif})', {
    release: '/static/img/$1'
});

/*html输出到根目录下*/
fis.match('views/(**.html)', {
    release: '$1'
});

/*首页输出到根目录下*/
fis.match('views/pages/index.html', {
    release: 'index.html'
});

/*配置domain*/

// fis.match('*', {
//     domain: '/3ad076'
// });

/*
  多状态处理  
  使用场景: 假设我们有如下需求，当在开发阶段资源都不压缩，但是在上线时做压缩，那么就可以使用这个配置了
  如何使用: fis3 release <media>  

  开发环境: fis3 release -wL
  线上环境: fis3 release prod (不用带多余参数, 会自动输出压缩包)
*/
fis.media('prod')
    .match('*', {
        domain: '/3ad076'
    })
    .match('*.js', {
      optimizer: fis.plugin('uglify-js')
    })
    .match("*.css", {
      optimizer: fis.plugin('clean-css')    
    })
    .match('**', {
      deploy: [
        fis.plugin('replace', {
            from: '$root$',
            to: '/3ad076/pages',
        }),
        fis.plugin('skip-packed', {
          // 配置项
        }),

        fis.plugin('zip', {
           filename: "wap_user.zip"
         }),
        fis.plugin('local-deliver', {
          to: '../'
        }) //must add a deliver, such as http-push, local-deliver
    ]
});

/*排除一些文件*/
fis.set('project.ignore', [
    "fis-conf.js",
    "/views/pages/yy2_register.html",
    "/views/pages/yy3_register.html",
    "/views/pages/yy4_register.html",
    "/views/pages/yy5_register.html",
    "/views/pages/wy_register.html",
    "/views/pages/gq_index.html"
]); 
```
