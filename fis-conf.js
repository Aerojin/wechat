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
fis.match('**.{tmpl,txt,md}', {    
    release: false
});

/*设置打包时自动处理模块化依赖关系*/
fis.match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    })
});

/*设置零散资源自动打包*/
fis.match('::packager', {
  postpackager: fis.plugin('loader', {
    allInOne: true,
    packOrder: 999
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

/*设置js压缩插件*/
fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});



/*设置css压缩插件*/
fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});



/*设置png图片压缩插件*/
fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});



/****************合并设置***************/

/*第三方组件合并处理*/
fis.match('modules/libs/**.js', {
  packTo: 'modules/libs/libs.js'
});

/*系统资源合并处理*/
fis.match('/libs/*.js', {
  packTo: '/libs/mod.js'
});


/*公共组件合并处理*/
fis.match('modules/common/base/**.js', {
    packTo: 'modules/common/common_base.js'
});

fis.match('modules/common/api/**.js', {
    packTo: 'modules/common/common_api.js'
});

fis.match('modules/common/kit/**.js', {
    packTo: 'modules/common/common_kit.js'
});

fis.match('modules/common/ui/**.js', {
    packTo: 'modules/common/common_ui.js'
});

/*样式合并处理*/
fis.match('views/css/**.css', {
    packTo: 'views/css/style.pack.css',
    packOrder: 1
});

fis.match('modules/common/**.css', {
    packTo: 'views/css/common.pack.css',
    packOrder: 0
});


/*图片输出处理*/
fis.match('views/**.{png,jpg,gif}', {
    release: '$0'
});

fis.match('modules/**/(*.{png,jpg,gif})', {
    release: 'views/images/$1'
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
/*
fis.match('*', {
    domain: '/app'
});
*/

fis.match('**', {
    deploy: [
        fis.plugin('replace', {
            from: '$root$',
            to: '/pages'
        }),
        fis.plugin('local-deliver') //must add a deliver, such as http-push, local-deliver
    ]
});