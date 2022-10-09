const BaseDButil = require('../db/BaseDButil');
const ResultUtil = require("../util/ResultUtil")
const TokenUtil = require("../util/TokenUtil")
const DateUtil = require("../util/DateUtil")

// 教师登录
const login = function (req, res) {
  const { zId, password } = req.body
  BaseDButil.queryOne(res, 'tb_teacher', { zId }, (data => {
    if (data && data.password === password) {
      const token = TokenUtil.generateToken({ teacherId: data['teacherId'], teacherName: data['teacherName'], zId: data['zId'] })
      ResultUtil.ok(res, { teacher: data, token })
    } else {
      ResultUtil.error(res, '账号或密码错误')
    }
  }))
}

// 查询当前教师负责的课程列表
const queryCourseList = async (req, res) => {
  const { teacherId } = req.auth
  const sql = `
    SELECT
      * 
    FROM
      tb_course 
    WHERE
      courseId IN ( SELECT courseId FROM tb_teacher_course WHERE teacherId = ? ) 
    ORDER BY
      courseId DESC
  `
  try {
    const courselist = await BaseDButil.CRUDMethod(sql, [teacherId])
    ResultUtil.ok(res, { courselist })
  } catch (error) {
    console.log(error);
    ResultUtil.error(res, '查询当前教师负责的课程列表失败')
  }
}

// 教师查询即将到来的会议列表
const queryWillMeetingList = async (req, res) => {
  const { teacherId } = req.auth
  const sql = `
  SELECT
    t1.teacherName,
    t3.courseName,
    t5.meetingId,
    t5.meetingName,
    t5.meetingType,
    t5.startTime,
    date_format( t5.calendar, '%Y-%m-%d' ) AS calendar 
  FROM
    tb_teacher AS t1,
    tb_teacher_course AS t2,
    tb_course AS t3,
    tb_course_meeting AS t4,
    tb_metting AS t5 
  WHERE
    t1.teacherId = ? 
    AND t2.teacherId = t1.teacherId 
    AND t3.courseId = t2.courseId 
    AND t4.courseId = t3.courseId 
    AND t5.meetingId = t4.meetingId 
    AND t5.calendar > (SELECT DATE_FORMAT( NOW(), '%Y-%m-%d' )) 
  ORDER BY
    t5.calendar DESC,
    t5.startTime DESC
  `
  try {
    const meetingList = await BaseDButil.CRUDMethod(sql, [teacherId])
    ResultUtil.ok(res, { meetingList })
  } catch (error) {
    console.log(error);
    ResultUtil.error(res, '查询当前教师负责的课程列表失败' + error)
  }
}

// 根据课程Id查询课程信息
const queryCourseInformationById = async (req, res) => {
  try {
    const { courseId } = req.query
    const courseSql = 'SELECT courseId,courseName FROM tb_course  WHERE courseId = ?'
    const groupSql = `
        SELECT
          count(*) studentCount,
          t1.groupName,
          t1.groupId 
        FROM
          tb_group AS t1
          LEFT JOIN (
          SELECT
            * 
          FROM
            tb_student_group 
          WHERE
          courseId =?) AS t2 ON t2.groupId = t1.groupId 
        GROUP BY
          t1.groupId
    `
    const courseList = await BaseDButil.CRUDMethod(courseSql, [courseId])
    const groupList = await BaseDButil.CRUDMethod(groupSql, [courseId])
    const courseInfo = courseList[0]
    ResultUtil.ok(res, { courseInfo: { ...courseInfo, groupList } })
  } catch (error) {
    console.log(error);
    ResultUtil.error(res, '根据课程Id查询课程信息' + error)
  }
}


// 创建/修改一门课程的RegularMeeting会议
/**
 *  1门课程只有一个RegularMeeting会议
 *  1、根据课程Id查询会议列表
 *    查到
 *      修改
 *        再查
 *    未查到
 *       添加
 *         查询
 */
const addRegularMeeting = async (req, res) => {
  try {
    const { courseId } = req.body
    const meetingSql = `
    SELECT
      t2.*,
      date_format(calendar, '%Y-%m-%d' ) AS calendar 
    FROM
      tb_course_meeting AS t1,
      tb_metting AS t2 
    WHERE
      courseId = ? 
      AND t1.meetingId = t2.meetingId 
      AND meetingType = 'Regular Meeting'
    `
    const meetingList = await BaseDButil.CRUDMethod(meetingSql, [courseId])
    const regularMeeting = meetingList[0]

    const setObj = { meetingType: "Regular Meeting" }
    Object.keys(req.body).forEach(key => {
      if (key !== 'courseId') {
        setObj[key] = req.body[key]
      }
    })


    if (regularMeeting) {
      // 更新
      BaseDButil.update(res, 'tb_metting', setObj, { meetingId: regularMeeting['meetingId'] }, () => {
        ResultUtil.ok(res, null)
      })
    } else {
      // 新增
      BaseDButil.insert(res, 'tb_metting', setObj, (meetingId) => {
        BaseDButil.insert(res, 'tb_course_meeting', { meetingId, courseId }, () => {
          ResultUtil.ok(res, null)
        })
      })
    }
  } catch (error) {
    console.log(error);
    ResultUtil.error(res, error)
  }
}


// 根据课程ID查询RegularMeeting会议信息 
const queryRegularMeetingByCourseId = async (req, res) => {
  try {
    const { courseId } = req.query
    const meetingSql = `
    SELECT
      t2.*,
      date_format(calendar, '%Y-%m-%d' ) AS calendar 
    FROM
      tb_course_meeting AS t1,
      tb_metting AS t2 
    WHERE
      courseId = ? 
      AND t1.meetingId = t2.meetingId 
      AND meetingType = 'Regular Meeting'
    `
    const meetingList = await BaseDButil.CRUDMethod(meetingSql, [courseId])
    ResultUtil.ok(res, { regularMeeting: meetingList[0] })
  } catch (error) {
    ResultUtil.error(res, error)
  }
}


// 教师根据课程Id及meetingType查询会议的任务列表
const queryMeetingTodoList = (req, res) => {
  const { zId } = req.auth
  const { courseId, meetingType } = req.body
  BaseDButil.queryAll(req, 'tb_todo', { courseId, zId, meetingType }, (todoList) => {
    ResultUtil.ok(res, { todoList })
  })
}

// 教师根据课程Id添加一个自己RegularMeeting会议的任务
const addMeetingTodo = async (req, res) => {
  const { zId } = req.auth
  const todoObj = req.body
  BaseDButil.insert(req, 'tb_todo', { ...todoObj, zId }, () => {
    ResultUtil.ok(res, null)
  })
}

// 教师根据todoId列表删除会议中的todo任务
const deleteTodo = async (req, res) => {
  const { todoId } = req.query
  BaseDButil.removeByIds(req, 'tb_todo', 'todoId', [todoId], () => {
    ResultUtil.ok(res, null)
  })
}


// 教师根据课程Id及meetingType查询会议的问答列表
const queryQuestionAnswerList = async (req, res) => {
  const { courseId, meetingType } = req.body
  try {
    const questionSql = `select *,date_format( createDate, '%Y-%m-%d %H:%i:%S' ) AS createDate from tb_question WHERE courseId = ? and meetingType = ? ORDER BY createDate desc`
    const answerSql = `select *,date_format( createDate, '%Y-%m-%d %H:%i:%S' ) AS createDate from tb_answer WHERE questionId = ? `
    const questions = await BaseDButil.CRUDMethod(questionSql, [courseId, meetingType])
    const questionList = []
    if (questions.length) {
      questions.forEach(async (question) => {
        const answerList = await BaseDButil.CRUDMethod(answerSql, [question.questionId])
        questionList.push({ ...question, answerList })
        if (questionList.length === questions.length)
          ResultUtil.ok(res, { questionList })
      })
    } else {
      ResultUtil.ok(res, { questionList })
    }

  } catch (error) {
    ResultUtil.error(res, error)
  }
}


// 教师根据课程Id创建问题
const addQuestion = async (req, res) => {
  const { zId, teacherName } = req.auth
  const { questionTitle, courseId, meetingType } = req.body
  const questionObj = { meetingType, questionTitle, courseId, zId, userName: teacherName, createDate: DateUtil.getCurrentDateTime() }
  BaseDButil.insert(res, 'tb_question', questionObj, (questionId) => {
    ResultUtil.ok(res, { ...questionObj, questionId })
  })
}

// 教师修改根据问题id修改问题
const updateQuestion = async (req, res) => {
  const { zId, teacherName } = req.auth
  const { questionTitle, questionId } = req.body
  const setObj = { questionTitle, zId, userName: teacherName }
  BaseDButil.update(res, 'tb_question', setObj, { questionId }, () => {
    ResultUtil.ok(res, null)
  })
}

// 教师根据问题id删除问题
const deleteQuestionByQuestionId = async (req, res) => {
  const { questionId } = req.query
  BaseDButil.removeByIds(res, 'tb_question', 'questionId', [questionId], () => {
    BaseDButil.removeByIds(res, 'tb_answer', 'questionId', [questionId], () => {
      ResultUtil.ok(res, null)
    })
  })
}

// 教师回答问题
const addAnswer = async (req, res) => {
  const { zId, teacherName } = req.auth
  const { answerContent, questionId } = req.body
  const answerObj = { answerContent, questionId, zId, userName: teacherName, createDate: DateUtil.getCurrentDateTime() }
  BaseDButil.insert(res, 'tb_answer', answerObj, (answerId) => {
    ResultUtil.ok(res, { ...answerObj, answerId })
  })
}

// 教师回答id修改回复
const updateAnswer = async (req, res) => {
  const { zId, teacherName } = req.auth
  const { answerContent, answerId } = req.body
  const setObj = { answerContent, zId, userName: teacherName }
  BaseDButil.update(res, 'tb_answer', setObj, { answerId }, () => {
    ResultUtil.ok(res, null)
  })
}

// 教师根据回答id删除回复
const deleteAnswerByAnswerId = async (req, res) => {
  const { answerId } = req.query
  BaseDButil.removeByIds(res, 'tb_answer', 'answerId', [answerId], () => {
    ResultUtil.ok(res, null)
  })
}

//根据groupId查询课程小组信息
const queryGroupInfoByGroupId = async (req, res) => {
  const { groupId } = req.query
  const groupSql = 'SELECT * FROM tb_group WHERE groupId = ?'
  const studentSql = 'SELECT * FROM tb_student WHERE studentId IN (SELECT studentId FROM tb_student_group WHERE groupId = ?)'
  try {
    const groupList = await BaseDButil.CRUDMethod(groupSql, [groupId])
    const studentList = await BaseDButil.CRUDMethod(studentSql, [groupId])
    const groupInfo = groupList[0]
    ResultUtil.ok(res, { groupInfo: { ...groupInfo, studentList } })
  } catch (err) {
    ResultUtil.error(res, err)
  }
}

//根据groupId和学生id、课程id 将学生从小组中移除
const removeStudentFromGroup = async (req, res) => {
  const { groupId, studentId, courseId } = req.query
  const removeSql = 'DELETE FROM tb_student_group WHERE groupId= ? and studentId= ? and courseId= ?'
  try {
    await BaseDButil.CRUDMethod(removeSql, [groupId, studentId, courseId])
    ResultUtil.ok(res, null)
  } catch (err) {
    ResultUtil.error(res, err)
  }
}


// 根据课程ID创建课程的OneOffMeeting会议
const addOneOffMeeting = async (req, res) => {
  try {
    const { courseId } = req.body
    const setObj = { meetingType: "One Off Meeting" }
    Object.keys(req.body).forEach(key => {
      if (key !== 'courseId') {
        setObj[key] = req.body[key]
      }
    })
    // 新增
    BaseDButil.insert(res, 'tb_metting', setObj, (meetingId) => {
      BaseDButil.insert(res, 'tb_course_meeting', { meetingId, courseId }, () => {
        BaseDButil.queryOne(res, 'tb_metting', { meetingId }, (meetingInfo) => {
          ResultUtil.ok(res, { meetingInfo })
        })
      })
    })
  } catch (error) {
    console.log(error);
    ResultUtil.error(res, error)
  }
}


// 根据课程ID查询OneOffMeeting会议列表
const queryOneOffMeetingList = async (req, res) => {
  try {
    const { courseId } = req.query
    const meetingSql = `
    SELECT
      t2.*,
      date_format(calendar, '%Y-%m-%d' ) AS calendar 
    FROM
      tb_course_meeting AS t1,
      tb_metting AS t2 
    WHERE
      courseId = ? 
      AND t1.meetingId = t2.meetingId 
      AND meetingType = 'One Off Meeting'
    `
    const meetingList = await BaseDButil.CRUDMethod(meetingSql, [courseId])
    ResultUtil.ok(res, { oneOffMeetingList: meetingList })
  } catch (error) {
    ResultUtil.error(res, error)
  }
}


// 查询出席会议的学生列表
const queryMeetingAttendStudentList = async (req, res) => {
  const { meetingId } = req.query
  const sql='SELECT * from tb_student WHERE studentId in (SELECT studentId from tb_student_metting WHERE joinState =1 and meetingId = ?)'
  try {
    const attentStudentList = await BaseDButil.CRUDMethod(sql,[meetingId])
    ResultUtil.ok(res, {attentStudentList})
  } catch (error) {
    ResultUtil.error(res,error)
  }
}

module.exports = {
  login,
  queryCourseList,
  queryWillMeetingList,
  queryCourseInformationById,
  addRegularMeeting,
  queryRegularMeetingByCourseId,
  queryMeetingTodoList,
  addMeetingTodo,
  deleteTodo,
  queryQuestionAnswerList,
  addQuestion,
  updateQuestion,
  deleteQuestionByQuestionId,
  addAnswer,
  updateAnswer,
  deleteAnswerByAnswerId,
  queryGroupInfoByGroupId,
  removeStudentFromGroup,
  addOneOffMeeting,
  queryOneOffMeetingList,
  queryMeetingAttendStudentList
}

