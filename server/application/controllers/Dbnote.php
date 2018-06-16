<?php
defined('BASEPATH') OR exit('No direct script access allowed');
//声明数据库
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class Dbnote extends CI_Controller {
    //声明传入参数$y
    public function index($y) {
        //数据库查询
        $z = DB::select('User1', ['Note'], ['UserID' => "{$y}"]);
        $a = $z[0];
        $this->json([
            $a
        ]);
    }
}