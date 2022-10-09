//导入express
const express = require('express');
//创建路由对象
const router = express.Router();
// 引入教师Controller
const TeacherController = require("../controller/TeacherController")

// 1、教师登录
router.post('/login', TeacherController.login);
// 2、查询当前教师负责的课程列表
router.get('/queryCourseList', TeacherController.queryCourseList);
// 3、查询教师快读会议列表
router.get('/queryWillMeetingList', TeacherController.queryWillMeetingList);
// 4、根据课程Id查询课程信息
router.get('/queryCourseInformationById', TeacherController.queryCourseInformationById);
// 5、创建一个课程的RegularMeeting会议
router.post('/addRegularMeeting', TeacherController.addRegularMeeting);
// 6、根据课程ID查询RegularMeeting会议信息 
router.get('/queryRegularMeetingByCourseId', TeacherController.queryRegularMeetingByCourseId);
// 7、教师根据课程Id及meetingType查询会议的任务列表
router.post('/queryMeetingTodoList', TeacherController.queryMeetingTodoList);
// 8、教师根据课程Id查询RegularMeeting会议的任务列表
router.post('/addMeetingTodo', TeacherController.addMeetingTodo);
// 9、教师根据todoId列表删除RegularMeeting会议中的todo任务
router.get('/deleteTodo', TeacherController.deleteTodo);
// 10、教师根据课程Id查询RegularMeeting会议的问答列表
router.post('/queryQuestionAnswerList', TeacherController.queryQuestionAnswerList);
// 11、教师根据课程Id创建问题
router.post('/addQuestion', TeacherController.addQuestion);
// 12、教师修改根据问题id修改问题
router.post('/updateQuestion', TeacherController.updateQuestion);
// 13、教师根据问题id删除问题
router.get('/deleteQuestionByQuestionId', TeacherController.deleteQuestionByQuestionId);
// 14、教师根据问题Id回答问题
router.post('/addAnswer', TeacherController.addAnswer);
// 15、教师根据回答Id修改回复内容
router.post('/updateAnswer', TeacherController.updateAnswer);
// 16、教师根据回答id删除回复
router.get('/deleteAnswerByAnswerId', TeacherController.deleteAnswerByAnswerId);
// 17、教师根据groupId查询课程小组信息
router.get('/queryGroupInfoByGroupId', TeacherController.queryGroupInfoByGroupId);
// 18、教师根据groupId和学生id、课程id 将学生从小组中移除
router.get('/removeStudentFromGroup', TeacherController.removeStudentFromGroup);
// 19、教师根据课程ID创建课程的OneOffMeeting会议
router.post('/addOneOffMeeting', TeacherController.addOneOffMeeting);
// 20、根据课程ID查询OneOffMeeting会议列表
router.get('/queryOneOffMeetingList', TeacherController.queryOneOffMeetingList);
// 21、根据会议ID查询查询出席学生列表
router.get('/queryMeetingAttendStudentList', TeacherController.queryMeetingAttendStudentList);

// 向外导出路由对象
module.exports = router;