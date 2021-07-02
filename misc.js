    _getOrgsWithAttribute1: function (attribute1) {
      return this.data.filter(row => row.attribute1 == attribute1)
    },
    _getOrgsWithAttribute1Names: function (attribute1) {
      return this.getOrgsWithAttribute1(attribute1)
                .map(row => row.org)
    },
    _getOrgByName: function (name) {
      return this.data.find(row => row.org == name)
    },
    _getAnswersByQuestionId: function (questionId) {
      return this.answersAll.filter(row => row.question_id == questionId)
    },
    _getSumAnswersByQuestionId: function (questionId) {
      return this.getAnswersByQuestionId(questionId).reduce(
        (accum, answer) => accum + answer.answer
      , 0)
    },
    _getAverageAnswersByQuestionId: function (questionId) {
      const sum = this.getSumAnswersByQuestionId(questionId)
      const length = this.getAnswersByQuestionId(questionId).length
      return sum / length
    },

    // dataAttribute1All: function () {
    //   return this.data.map(row => row.attribute1)
    // },
    // dataAttribute1Unique: function () {
    //   return [...new Set(this.dataAttribute1All)]
    // }

      // return this.data.reduce((accum, row) => {
      //   return accum.concat(row.answers)
      // }, [])
