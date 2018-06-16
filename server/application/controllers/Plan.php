<?php
defined('BASEPATH') OR exit('No direct script access allowed');
//声明数据库
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class Plan extends CI_Controller {
    public function index($id) {
    }

    //获取计划列表(finished)
    public function getPlanList($id) {
        //从Plan表获取id对应的Plan并赋给$planList
        $planList = DB::select('Plan', ['*'], "`UserID` = '{$id}' order by DateEnd");

        //判断结果是否为空
        if($planList == null){
            $this->json([$id]);
        }
        else{
            //num是查询结果的个数
            $num = DB::select('Plan', ['count(PlanID)'], "`UserID` = '{$id}' order by DateEnd");
            $num = $num[0];
            $cnt = 'count(PlanID)';
            $num = (int)($num->$cnt);

            $i = 0;
            //res是返回用的数组
            $res = array();

            $active = array();
            $finish = array();
            $i1=0;
            $i2=0;

            for($i = 0;$i < $num;$i = $i + 1){
                if($planList[$i]->Pages == $planList[$i]->Process){
                    $finish[$i2] = $planList[$i];
                    $i2++;
                }
                else{
                    $active[$i1] = $planList[$i];
                    $i1++;
                }
            }

            for($i = 0; $i < $i2; $i++){
                $active[$i1+$i] = $finish[$i];
            }

            $planList = $active;
            
            //通过num循环获取计划的信息
            for($i = 0;$i < $num;$i = $i + 1){
                //将想返回的信息存到res数组里，注意语法
                $res[$i]['userId'] = $id;
                $res[$i]['planId'] = $planList[$i]->PlanID;
                $res[$i]['bookName'] = $planList[$i]->BookName;
                $res[$i]['dateStart'] = $planList[$i]->DateStart;
                $res[$i]['dateFinish'] = $planList[$i]->DateEnd;
                $res[$i]['description'] = $planList[$i]->Description;
                $res[$i]['pagesFinished'] = $planList[$i]->Process;
                $res[$i]['isPrivate'] = $planList[$i]->Privacy;
                $res[$i]['bookImgUrl'] = $planList[$i]->ImageUrl;
                $res[$i]['isbn13'] = $planList[$i]->ISBN13;
                $res[$i]['pagesTotal'] = $planList[$i]->Pages;
                $res[$i]['price'] = $planList[$i]->Price;
                $res[$i]['realBookName'] = $planList[$i]->RealBookName;
                $res[$i]['rating'] = $planList[$i]->Rating;
                $res[$i]['author'] = $planList[$i]->Author;
                $res[$i]['tags'] = $planList[$i]->Tags;
            }
            $this->json($res);
        }
      }

      public function getPublicPlan($id) {
        $planList = DB::select('Plan', ['*'], "`UserID` = '{$id}' and Privacy = 1");

        //判断结果是否为空
        if($planList == null){
            $this->json([$id]);
        }
        else{
            //num是查询结果的个数
            $num = DB::select('Plan', ['count(PlanID)'], "`UserID` = '{$id}' and Privacy = 1");
            $num = $num[0];
            $cnt = 'count(PlanID)';
            $num = (int)($num->$cnt);

            $i = 0;
            //res是返回用的数组
            $res = array();
            
            //通过num循环获取计划的信息
            for($i = 0;$i < $num;$i = $i + 1){
                //将想返回的信息存到res数组里，注意语法
                $res[$i]['userId'] = $id;
                $res[$i]['planId'] = $planList[$i]->PlanID;
                $res[$i]['bookName'] = $planList[$i]->BookName;
                $res[$i]['dateStart'] = $planList[$i]->DateStart;
                $res[$i]['dateFinish'] = $planList[$i]->DateEnd;
                $res[$i]['description'] = $planList[$i]->Description;
                $res[$i]['pagesFinished'] = $planList[$i]->Process;
                $res[$i]['isPrivate'] = $planList[$i]->Privacy;
                $res[$i]['bookImgUrl'] = $planList[$i]->ImageUrl;
                $res[$i]['isbn13'] = $planList[$i]->ISBN13;
                $res[$i]['pagesTotal'] = $planList[$i]->Pages;
                $res[$i]['price'] = $planList[$i]->Price;

                $res[$i]['realBookName'] = $planList[$i]->RealBookName;
                $res[$i]['rating'] = $planList[$i]->Rating;
                $res[$i]['author'] = $planList[$i]->Author;
                $res[$i]['tags'] = $planList[$i]->Tags;
            }
            /*  这个是将查询到的json对象的某个键值对的值提出来的过程
            $test = $planList[0];
            $ttt = $test->PlanID;
            $ttt = (int)$ttt;
            */
            $this->json($res);
        }
      }

    //获取进行中计划(finished)
    public function getActivePlan($id) {
        //从Plan表获取id和日期对应的Plan并赋给$planList
        $planList = DB::select('Plan', ['*'], "`UserID` = '$id' and `Process`<`Pages` order by DateEnd");
        //判断结果是否为空
        if($planList == null){
            $this->json([$id]);
        }
        else{
            //计算结果个数
            $num = DB::select('Plan', ['count(PlanID)'], "`UserID` = '$id' and `Process`<`Pages` order by DateEnd");
            $num = $num[0];
            $cnt = 'count(PlanID)';
            $num = (int)($num->$cnt);
            $i = 0;
            $res = array();
            
            for($i = 0;$i < $num;$i = $i + 1){
                $res[$i]['userId'] = 'oieeV5P3MUvnf3k1lUw5C2NQ1yHw';
                $res[$i]['planId'] = $planList[$i]->PlanID;
                $res[$i]['bookName'] = $planList[$i]->BookName;
                $res[$i]['dateStart'] = $planList[$i]->DateStart;
                $res[$i]['dateFinish'] = $planList[$i]->DateEnd;
                $res[$i]['description'] = $planList[$i]->Description;
                $res[$i]['pagesFinished'] = $planList[$i]->Process;
                $res[$i]['isPrivate'] = $planList[$i]->Privacy;
                $res[$i]['bookImgUrl'] = $planList[$i]->ImageUrl;
                $res[$i]['isbn13'] = $planList[$i]->ISBN13;
                $res[$i]['pagesTotal'] = $planList[$i]->Pages;
                $res[$i]['price'] = $planList[$i]->Price;

                $res[$i]['realBookName'] = $planList[$i]->RealBookName;
                $res[$i]['rating'] = $planList[$i]->Rating;
                $res[$i]['author'] = $planList[$i]->Author;
                $res[$i]['tags'] = $planList[$i]->Tags;
            }
            $this->json($res);
        }
    }

    //获取指定计划(finished)
    public function getCertainPlan($pid) {
        $planList = DB::select('Plan', ['*'], "`PlanID` = '$pid'");
        //判断结果是否为空
        if($planList == null){
            $this->json([]);
        }
        else{
            $res = array();
            for($i = 0;$i < 1;$i = $i + 1){
                $res[$i]['userId'] = $planList[$i]->UserID;
                $res[$i]['planId'] = $planList[$i]->PlanID;
                $res[$i]['bookName'] = $planList[$i]->BookName;
                $res[$i]['dateStart'] = $planList[$i]->DateStart;
                $res[$i]['dateFinish'] = $planList[$i]->DateEnd;
                $res[$i]['description'] = $planList[$i]->Description;
                $res[$i]['pagesFinished'] = $planList[$i]->Process;
                $res[$i]['isPrivate'] = $planList[$i]->Privacy;
                $res[$i]['bookImgUrl'] = $planList[$i]->ImageUrl;
                $res[$i]['isbn13'] = $planList[$i]->ISBN13;
                $res[$i]['pagesTotal'] = $planList[$i]->Pages;
                $res[$i]['price'] = $planList[$i]->Price;

                $res[$i]['realBookName'] = $planList[$i]->RealBookName;
                $res[$i]['rating'] = $planList[$i]->Rating;
                $res[$i]['author'] = $planList[$i]->Author;
                $res[$i]['tags'] = $planList[$i]->Tags;
            }
            $this->json($res);
        }
    }
    
    //获取年度计划(finished)
    public function getYearlyPlanList($id,$yid) {
        //计算年度范围
        $y1 = $yid."-01-01";
        $y2 = $yid."-12-31";
        //进行查询
        $planList = DB::select('Plan', ['*'], "`UserID` = '$id' and `DateStart` >= '$y1' and `DateStart` <= '$y2'");
        
        //判断结果是否为空
        if($planList == null){
            $this->json();
        }
        else{
            $num = DB::select('Plan', ['count(PlanID)'], "`UserID` = '$id' and `DateStart` >= '$y1' and `DateStart` <= '$y2'");
            $num = $num[0];
            $cnt = 'count(PlanID)';
            $num = (int)($num->$cnt);
            $i = 0;
            $res = array();
            for($i = 0;$i < $num;$i = $i + 1){
                $res[$i]['userId'] = 'oieeV5P3MUvnf3k1lUw5C2NQ1yHw';
                $res[$i]['planId'] = $planList[$i]->PlanID;
                $res[$i]['bookName'] = $planList[$i]->BookName;
                $res[$i]['dateStart'] = $planList[$i]->DateStart;
                $res[$i]['dateFinish'] = $planList[$i]->DateEnd;
                $res[$i]['description'] = $planList[$i]->Description;
                $res[$i]['pagesFinished'] = $planList[$i]->Process;
                $res[$i]['isPrivate'] = $planList[$i]->Privacy;
                $res[$i]['bookImgUrl'] = $planList[$i]->ImageUrl;
                $res[$i]['isbn13'] = $planList[$i]->ISBN13;
                $res[$i]['pagesTotal'] = $planList[$i]->Pages;
                $res[$i]['price'] = $planList[$i]->Price;

                $res[$i]['realBookName'] = $planList[$i]->RealBookName;
                $res[$i]['rating'] = $planList[$i]->Rating;
                $res[$i]['author'] = $planList[$i]->Author;
                $res[$i]['tags'] = $planList[$i]->Tags;
            }
            $this->json($res);
        }
    }

    //提交计划数据
    public function uploadPlanData(){
        $res = $_POST["count"];
        $innum=0;
        $upnum=0;
        for($i = 0;$i < $res;$i = $i + 1){
            $UserID = "UserID" . $i;
            $PlanID = "PlanID" . $i;
            $BookName = "BookName" . $i;
            $DateStart = "DateStart" . $i;
            $DateEnd = "DateEnd" . $i;
            $Description = "Description" . $i;
            $Process = "Process" . $i;
            $Privacy = "Privacy"  . $i;

            $Author = "Author"  . $i;
            $Rating = "Rating"  . $i;
            $Tags = "Tags"  . $i;
            $RealBookName ="RealBookName"  . $i;
            
            $Price = "Price" . $i;
            $Pages = "Pages" . $i;
            $ImageUrl = "ImageUrl" . $i;
            $ISBN13 = "ISBN13" . $i;
            $PlanID = $_POST["$PlanID"];
            $UserID = $_POST["$UserID"];
            $BookName = $_POST["$BookName"];
            $DateStart = $_POST["$DateStart"];
            $DateEnd = $_POST["$DateEnd"];
            $Description = $_POST["$Description"];
            $Process = $_POST["$Process"];
            $Privacy = $_POST["$Privacy"];
            if($Privacy == "true"){
                $Privacy = 0;
            }
            else{
                $Privacy = 1;
            }
            $Price = $_POST["$Price"];
            $Pages = $_POST["$Pages"];
            $ImageUrl = $_POST["$ImageUrl"];
            $ISBN13 = $_POST["$ISBN13"];
            
            $Author = $_POST["$Author"];
            $Rating = $_POST["$Rating"];
            $Tags = $_POST["$Tags"];
            $RealBookName = $_POST["$RealBookName"];

            $test = DB::select('Plan', ['*'], "`PlanID` = '$PlanID'");
            if($test == null){
                DB::insert('Plan', [
                'UserID' => $UserID,
                'PlanID' => $PlanID,
                'BookName' => $BookName,
                'DateStart' => $DateStart,
                'DateEnd' => $DateEnd,
                'Description' => $Description,
                'Process' => $Process,
                'Privacy' => $Privacy,
                'Price' => $Price,
                'Pages' => $Pages,
                'ImageUrl' => $ImageUrl,
                'ISBN13' => $ISBN13,
                'RealBookName' => $RealBookName,
                'Rating' => $Rating,
                'Tags' => $Tags,
                'Author' => $Author
                ]); // => 1
                $innum += 1;
            }
            else{
                DB::update('Plan', [
                'UserID' => $UserID,
                'BookName' => $BookName,
                'DateStart' => $DateStart,
                'DateEnd' => $DateEnd,
                'Description' => $Description,
                'Process' => $Process,
                'Privacy' => $Privacy,
                'Price' => $Price,
                'Pages' => $Pages,
                'ImageUrl' => $ImageUrl,
                'ISBN13' => $ISBN13
                ]
                ,"`PlanID` = '$PlanID'"); // => 1
                $upnum += 1;
            }
        }
        $this->json([
            '插入' => $innum,
            '更新' => $upnum
        ]);
    }


    //添加计划
    public function addPlan($pid,$uid,$sd,$ed,$des,$pro,$pri,$prc,$pag,$imu) {
          DB::insert('Plan', [
          'PlanID' => $pid,
          'UserID' => $uid,
          'DateStart' => $sd,
          'DateEnd' => $ed,
          'Description' => $des,
          'Process' => $pro,
          'Privacy' =>$pri,
          'Price' =>$prc,
          'Pages' =>$pag,
          'ImageUrl' =>$imu
          ]); // => 1
    }

    //添加计划2
    public function addPlan1($pid,$bn,$isbn) {
        $bn = urldecode($bn);
          DB::update('Plan', [
          'BookName' =>$bn,
          'ISBN13' =>$isbn
          ],"`PlanID` = '$pid'");
    }

    //删除计划
    public function deletePlan($pid){
        DB::delete('Plan', "PlanID = '{$pid}'");
    }

    //更新计划(finished)
    public function updatePlan($pid,$uid,$sd,$ed,$des,$pro,$pri,$prc,$pag,$imu) {
        $des = urldecode($des);

        $imu = str_replace('%2B','+',$imu);
        $imu = str_replace('%20',' ',$imu);
        $imu = str_replace('%2F','/',$imu);
        $imu = str_replace('%3F','?',$imu);
        $imu = str_replace('%25','%',$imu);
        $imu = str_replace('%23','#',$imu);
        $imu = str_replace('%26','&',$imu);
        $imu = str_replace('%3D','=',$imu);
        $imu = str_replace('%3A',':',$imu);

          DB::update('Plan', [
          'UserID' => $uid,
          'DateStart' => $sd,
          'DateEnd' => $ed,
          'Description' => $des,
          'Process' => $pro,
          'Privacy' =>$pri,
          'Price' =>$prc,
          'Pages' =>$pag,
          'ImageUrl' =>$imu
          ],"`PlanID` = '$pid'");
    }
    //(finished)
    public function updatePlan1($pid,$bn,$isbn) {
        $bn = urldecode($bn);
          DB::update('Plan', [
          'BookName' =>$bn,
          'ISBN13' =>$isbn
          ],"`PlanID` = '$pid'");
    }

    public function getHotList(){
        $planList = DB::select('Plan', ['ISBN13,count(*)'], "`ISBN13` <> '0' group by ISBN13 order by count(*) desc");
        $result = array();
        $cnt = "count(*)";
        for($i=0;$i<10;$i=$i+1){
            $isbn = $planList[$i]->ISBN13;
            $bookInfo = DB::row('Plan', ['*'], "`ISBN13`=$isbn");

            $result[$i]['rating'] = $bookInfo->Rating;
            $result[$i]['author'] = $bookInfo->Author;
            $result[$i]['tags'] = $bookInfo->Tags;
            $result[$i]['title'] = $bookInfo->RealBookName;

            $result[$i]['isbn13'] = $isbn;
            $result[$i]['image'] = $bookInfo->ImageUrl;
            //$result[$i]['title'] = $bookInfo->BookName;
            $result[$i]['count'] = $planList[$i]->$cnt;
        }
            $this->json($result);
        
    }
}