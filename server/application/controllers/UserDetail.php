<?php
defined('BASEPATH') OR exit('No direct script access allowed');
//声明数据库
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class UserDetail extends CI_Controller {
    public function index($id) {
        $res = DB::select('User', ['UserID'], ['UserID' => "{$id}"]);
        if($z != null){
            $this->json([
                
          ]);
        }

        //从数据库user1获取id并赋给$z
        $z = DB::select('User1', ['UserID'], ['UserID' => "{$y}"]);

        //判断数据库中是否有主键冲突
        if($z != null){
            $this->json([
            'UserID已存在'
          ]);
        }

        else{        
          //数据库插入
          DB::insert('User1', [
          'UserID' => $y,
          'NickName' => $decode,
          'Note' => $deNote
          ]); // => 1

          //数据库查询
          $z = DB::select('User1', ['UserID'], ['UserID' => "{$y}"]);
          $z1 = DB::select('User1', ['NickName'], ['UserID' => "{$y}"]);
          
          $a = $z[0];
          $b = $z1[0];
          $this->json([
              '数据库插入成功' => [
                  'ID' => $a,
                  'Name' => $b
              ]
          ]);
        }
    }
}