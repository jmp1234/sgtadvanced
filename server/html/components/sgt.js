


class SGT_template{

	constructor( elementConfig ){
		this.elementConfig = elementConfig;
		this.data = {};

		this.handleCancel = this.handleCancel.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.deleteStudent = this.deleteStudent.bind(this);
		this.getStudents = this.getStudents.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}


	addEventHandlers(){
		this.elementConfig.addButton.on('click', this.handleAdd);
		this.elementConfig.cancelButton.on('click', this.handleCancel);
		this.elementConfig.serverButton.on('click', this.getStudents);
		this.elementConfig.modal.on('click', this.closeModal);
	}

	clearInputs(){
		for(var input in this.elementConfig) {
			if(/Input/.test(input)) {
				$(this.elementConfig[input]).val('');
			}
		}
	}

	handleCancel(){
		this.clearInputs()
	}

	handleAdd(){
		var nameValue = $(this.elementConfig.nameInput).val()
		var courseValue = $(this.elementConfig.courseInput).val()
		var gradeValue = $(this.elementConfig.gradeInput).val()
		// if(nameValue && courseValue && gradeValue && !isNaN(gradeValue)) {

			// this.createStudent( nameValue, courseValue, gradeValue);
			// if(this.createStudent) {
			this.sendStudentDataToServer(nameValue, courseValue, gradeValue);
			// }
			this.clearInputs();
		// }
	}

	displayAllStudents(){

		// var mostRecentStudentId = Object.keys(this.data)[Object.keys(this.data).length - 1];
		// this.elementConfig.displayArea.append(this.data[mostRecentStudentId].render());
		$(this.elementConfig.displayArea).children().remove()
		for(var student in this.data) {
			this.elementConfig.displayArea.append(this.data[student].render());
		}
		this.displayAverage();
	}



	displayAverage(){
		var total = null
		for(var student in this.data) {
			total += this.data[student].data.grade;
		}
		var average = total / Object.keys(this.data).length;
		$(this.elementConfig.averageArea).text(average.toFixed(2))
	}


	createStudent( name, course, grade, id){
		// var studentIds = Object.keys(this.data).sort(function(x,y) {
		// 	return parseInt(x) - parseInt(y);
		// });

		/*if(!id) {
			if(studentIds.length === 0) {
				id = 1;
			} else {
				id = parseInt(studentIds[studentIds.length-1]) + 1;
			}
		} else*/
		if(id) {
			for(var item in this.data) {
				if(parseInt(item) === id) {
					return false;
				}
			}
		}
		var student = new Student(id, name, course, grade, this.deleteStudent);
		this.data[id] = student;
		return true;
	}

	doesStudentExist(id){

		if(id && Object.keys(this.data).indexOf(id.toString()) >= 0) {
			return true;
		} else {
			return false;
		}
	}

	readStudent( id ){

		if(this.doesStudentExist(id)){
			return this.data[id];
		} else if(!id) {
			var studentArray = [];
			for( var student in this.data) {
				studentArray.push(this.data[student]);
			}
			return studentArray;
		} else {
			return false;
		}
	}

	updateStudent( id, field, value ){
		if(doesStudentExist(id)) {
			this.data[id].data[field] = value;
			return true;
		} else {
			return false;
		}
	}

	deleteStudent(id, domElementRow){

		if(this.doesStudentExist(id)) {
			this.deleteFromDatabase(id, domElementRow)
			delete this.data[id];
			return true;
		}
		return false;
	}


	showErrorModal( response ) {
		$('.errorModalShadow h4').text(response.errors)
		this.elementConfig.modal.show();
	}

	closeModal() {
		this.elementConfig.modal.hide();
	}



	getStudents() {
		var sgt = this;
		var ajaxOptions = {
			url: 'api/grades',
			method: 'get',
			data: {
				'api_key': '7uS1nWx4hT',
			},
			dataType: 'json',
			success: function(response) {
				if(response.success) {
					console.log('success!!!');
					console.log(response.data)
					for(var student=0; student<response.data.length; student++) {
							sgt.createStudent(response.data[student].name, response.data[student].course, response.data[student].grade, response.data[student].id);
					}
					sgt.displayAllStudents();
					return true;
				} else {
				console.log(response.errors)
				sgt.showErrorModal( response )
				}
			},
			error: function(response) {
				console.log('error in connecting to ajax! error 500')
			},
			complete: function() {
				$('.loader').remove();
			}
		}
		$.ajax(ajaxOptions);
	}


	sendStudentDataToServer(name, course, grade) {
		var sgt = this;
		var ajaxOptions = {
			url: 'api/grades',
			method: 'post',
			data: {
				'api_key': '7uS1nWx4hT',
				'name': name,
				'course': course,
				'grade': grade,
			},
			dataType: 'json',
			success: function(response) {
				if(response.success) {
					console.log('success! you sent student data to the server!');
					sgt.getStudents();
				} else {
					console.log(response.errors)
					sgt.showErrorModal( response )
					return false;
				}
			},
			error: function(response) {
				console.log('error in connecting to ajax! error 500');
			},
		}
		$.ajax(ajaxOptions);

	}

	deleteFromDatabase(id, domElementRow) {
		var sgt = this;
		var ajaxOptions = {
			url: 'api/grades?student_id=' + id,
			method: 'delete',
			dataType: 'json',
			success: function(response) {
				if(response.success) {
					console.log('deleted from database')
					$(domElementRow).remove();
				} else {
					console.log(response.errors);
					sgt.showErrorModal(response)
					return false;
				}
			},
			error: function(response) {
				console.log('error in connecting to ajax! error 500')

			},
		}
		$.ajax(ajaxOptions);
	}



}
