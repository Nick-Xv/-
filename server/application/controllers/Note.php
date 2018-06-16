<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use QCloud_WeApp_SDK\Mysql\Mysql as DB;

class Note extends CI_Controller {
    public function index($id) {
    }
    public function deleteNote($noteid)
    {
         $rows = DB::delete('Note', ['NoteID' => $noteid]);
         $this->json([$rows]);
    }

    public function uploadNote()
    {
            $NoteID = $_POST["noteId"];
            $UserID = $_POST["userId"];
            $PlanID = $_POST["planId"];
            $CreateTime = $_POST["createTime"];
            $Content = $_POST["content"];
            $Privacy = $_POST["isPrivate"];
            if($Privacy == "true"){
                $Privacy = 0;
            }
            else{
                $Privacy = 1;
            }
            $test = DB::select('Note',['*'], ['NoteID' => $NoteID]);
            if($test == null){
                DB::insert('Note',[
                'NoteID' => $NoteID,
                'UserID' => $UserID,
                'PlanID' => $PlanID,
                'CreateTime' => $CreateTime,
                'Content' => $Content,
                'Privacy' => $Privacy
            ]);
            }
            else{
                DB::update('Note',[
                'UserID' => $UserID,
                'PlanID' => $PlanID,
                'CreateTime' => $CreateTime,
                'Content' => $Content,
                'Privacy' => $Privacy
            ],['NoteID' => $NoteID]);
            }
            $this->json([
                'content' => $Content
            ]);
        
    }

    public function getAllNote($id)
    {
       //从Plan表获取id对应的Plan并赋给$noteList
        $noteList = DB::select('Note', ['*'],"UserID = '$id' order by CreateTime desc");

        //判断结果是否为空
        if($noteList == null){
            $this->json([$id]);
        }
        else{
            //num是查询结果的个数
            $num = DB::select('Note', ['count(NoteID)'], ['UserID' => "{$id}"]);
            $num = $num[0];
            $cnt = 'count(NoteID)';
            $num = (int)($num->$cnt);

            $i = 0;
            //res是返回用的数组
            $res = array();
            
            //通过num循环获取笔记的信息
            for($i = 0;$i < $num;$i = $i + 1){
                $res[$i]['noteId'] = $noteList[$i]->NoteID;
                $res[$i]['userId'] = $noteList[$i]->UserID;
                $res[$i]['planId'] = $noteList[$i]->PlanID;
                $res[$i]['createTime'] = $noteList[$i]->CreateTime;
                $res[$i]['content'] = $noteList[$i]->Content;
                $res[$i]['isPrivate'] = $noteList[$i]->Privacy;
            }
          
            $this->json($res);
        }
    }
    
	public function getPlanNote($id)
	{
		$noteList = DB::select('Note', ['*'], ['PlanID' => "{$id}"]);

        //判断结果是否为空
        if($noteList == null){
            $this->json([$id]);
        }
        else{
            //num是查询结果的个数
            $num = DB::select('Note', ['count(NoteID)'], ['PlanID' => "{$id}"]);
            $num = $num[0];
            $cnt = 'count(NoteID)';
            $num = (int)($num->$cnt);

            $i = 0;
            //res是返回用的数组
            $res = array();
            
            //通过num循环获取笔记的信息
            for($i = 0;$i < $num;$i = $i + 1){

                //将想返回的信息存到res数组里，注意语法
                $res[$i]['noteId'] = $noteList[$i]->NoteID;
                $res[$i]['planId'] = $noteList[$i]->PlanID;
                $res[$i]['content'] = $noteList[$i]->Content;
                $res[$i]['isPrivate'] = $noteList[$i]->Privacy;
                $res[$i]['createTime'] = $noteList[$i]->CreateTime;
            }
          
            $this->json($res);
        }
	}
}