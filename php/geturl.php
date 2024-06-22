<?php
//从前端获取要获取的软件名称
//版本号之类的
$name=$_GET["name"];
$version=$_GET["version"];
$system=$_GET["system"];
$json_data = file_get_contents("../data/launcher.js");
$jxjson=json_decode($content,JSON_UNESCAPED_UNICODE);
//顺便声明一下，安卓和苹果不分顺序
if ($name==""||$version==""||$system==""){
echo "参数不能为空";
}else{
//安卓
if ($system=="Android"){

}
}
>