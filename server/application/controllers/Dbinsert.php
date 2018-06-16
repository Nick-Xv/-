<?php
defined('BASEPATH') OR exit('No direct script access allowed');
//声明数据库
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class Dbinsert extends CI_Controller {
    //声明传入参数$y,$n,$note
    public function index($y,$n,$note) {
        //如果传入字符串可能有中文，用这个去解码
        $decode = urldecode($n);
        $deNote = urldecode($note);
        
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

    public function testPost(){
        $res = $_POST["count"];
        $result = array();
        for($i = 0;$i < $res;$i = $i + 1){
            $UserID = "UserID" . $i;
            $PlanID = "PlanID" . $i;
            $BookName = "BookName" . $i;

                $result[$i]['userId'] = $_POST["$UserID"];
                $result[$i]['planId'] = $_POST["$PlanID"];
                $result[$i]['bookName'] = $_POST["$BookName"];
            }
        $this->json([
            '结果' => $result
        ]);
    }


    public function test($y,$n,$note) {
        $decode = urldecode($n);
        $deNote = urldecode($note);
        
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