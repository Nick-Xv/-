<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class Friend extends CI_Controller {
    public function index($id) {
    }

    public function friendListDetail($id){
        $friendList = DB::select('Friend', ['ID2'], "ID1 = '$id'");
        $num1 = DB::select('Friend', ['count(ID1)'], "ID1 = '$id'");
        $num = $num1[0];
        $cnt = 'count(ID1)';
        $num = $num->$cnt;
        $num = (int)$num;
        $i = 0;
        //res是返回用的数组
        $res = array();
        
        $ii = 0;
        //通过num循环获取好友的信息
        for($i = 0;$i < $num;$i = $i + 1){
            //将想返回的信息存到res数组
            $fid = $friendList[$i]->ID2;
            $numtest = DB::select('User', ['count(UserID)'], "UserID = '$fid'");
            $numtest = $numtest[0];
            $cnt2 = 'count(UserID)';
            $numtest = $numtest->$cnt2;
            $numtest = (int)$numtest;
            $detail = DB::select('User', ['*'], "UserID = '$fid'");
            if($numtest == 0){
                continue;
            }
            else{
                
            $res[$ii]['openId'] = $friendList[$i]->ID2;
            $res[$ii]['avatarUrl'] = $detail[0]->ImageUrl;
            $res[$ii]['nickName'] = $detail[0]->NickName;
            $res[$ii]['annualPlan'] = $detail[0]->AnnualPlan;
            $res[$ii]['annualPlanF'] = $detail[0]->AnnualPlanF;
            $ii = $ii + 1;
            }
        }
        $this->json(
            $res
        );
    }

    public function addFriend($id1, $id2) {
        $isExisted1 = DB::select('User', ['*'], "UserID = '$id1'");
        $isExisted2 = DB::select('User', ['*'], "UserID = '$id2'");
        if($isExisted1 == null || $isExisted2 == null) {
        
    }
    else{
        $isExisted = DB::select('Friend', ['*'], "ID1 = '$id1' and ID2 = '$id2'");
            if($isExisted == null) {
                DB::insert('Friend', [
                'ID1' => $id1,
                'ID2' => $id2
                ]); // => 1
            }
            $isExisted = null;
            $isExisted = DB::select('Friend', ['*'], "ID1 = '$id2' and ID2 = '$id1'");
            if($isExisted == null) {
                DB::insert('Friend', [
                'ID1' => $id2,
                'ID2' => $id1
                ]); // => 1
            }
        }
    }
    public function getFriendList($id1) {
      //从Friend表获取id对应的Friend并赋给$FriendList
        $FriendList = DB::select('Friend', ['ID2'], "ID1 = '$id1'");

        //判断结果是否为空
        if($FriendList == null){
            $this->json([$id1]);
        }
        else{
            //num是查询结果的个数
            $num = DB::select('Friend', ['count(ID2)'], "ID1 = '$id1'");
            $num = $num[0];
            $cnt = 'count(ID2)';
            $num = (int)($num->$cnt);

            $i = 0;
            //res是返回用的数组
            $res = array();
            
            //通过num循环获取计划的信息
            for($i = 0;$i < $num;$i = $i + 1){
                //将想返回的信息存到res数组里，注意语法
                $res[$i]['ID2'] = $FriendList[$i]->ID2;
            }
            $this->json($res);
        }
    }

    public function deleteFriend($id1, $id2) {
        DB::delete('Friend', "ID1 = '{$id1}' and ID2 = '{$id2}'");
        DB::delete('Friend', "ID1 = '{$id2}' and ID2 = '{$id1}'");
    }
}