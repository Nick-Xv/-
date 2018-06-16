<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;
use \QCloud_WeApp_SDK\Auth\LoginService as LoginService; 
use QCloud_WeApp_SDK\Constants as Constants;

class User extends CI_Controller {
    public function regist(){
        $userId = $_POST['openId'];
        $imageUrl = $_POST['avatarUrl'];
        if($imageUrl == ""){
            $imageUrl = "/res/user-unlogin.png";
        }
        $nickName = $_POST['nickName'];

        $z = DB::select('User', ['UserID'], ['UserID' => "{$userId}"]);
        //判断数据库中是否有主键冲突
        if($z != null){
            $this->json([
                '插入失败'
            ]);
        }
        else{
            DB::insert('User', [
            'UserID' => $userId,
            'ImageUrl' => $imageUrl,
            'NickName' => $nickName,
            'AnnualPlan' => 0,
            'AnnualPlanF' => 0
            ]); // => 1
            $this->json([
                '插入成功'
            ]);
        }    
    }

    public function queryPlan($id){
        $info = DB::select('User', ['*'], ['UserID' => "{$id}"]);
        $info = $info[0];
        $this->json([
            'total' => $info->AnnualPlan,
            'finished' => $info->AnnualPlanF
        ]);
    }

    public function setPlan($id,$num){
        DB::update('User', ['AnnualPlan' => $num], ['UserID' => "{$id}"]);
    }

    public function calPlanF($id){
        $y1 = "2018-01-01";
        $y2 = "2018-12-31";
        $num = DB::select('Plan',['count(PlanID)'],"UserID = '{$id}' and Process = Pages and `DateStart` >= '$y1' and `DateStart` <= '$y2'");
        $num = $num[0];
        $cnt = 'count(PlanID)';
        $num = (int)($num->$cnt);
        DB::update('User', ['AnnualPlanF' => $num], ['UserID' => "{$id}"]);
        $this->json([
            'num' => $num
        ]);
    }

    public function calAnnualCost($id){
        $y1 = "2018-01-01";
        $y2 = "2018-12-31";
        $cost = DB::select('Plan',['sum(Price)'],"UserID = '{$id}' and `DateStart` >= '$y1' and `DateStart` <= '$y2'");
        $cost = $cost[0];
        $cnt = 'sum(Price)';
        $cost = (float)($cost->$cnt);
        $this->json([
            'cost' => $cost
        ]);
    }

    public function index() {
        $result = LoginService::check();
/*
        DB::getInstance();
        DB::insert('User1', [
            'UserID' => '123',
            'NickName' => '徐云浩'
        ]);
*/
        if ($result['loginState'] === Constants::S_AUTH) {
            $this->json([
                'code' => 0,
                'data' => $result['userinfo']
            ]);
        } else {
            $this->json([
                'code' => -1,
                'data' => []
            ]);
        }
    }
}
