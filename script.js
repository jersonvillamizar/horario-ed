let courses = [];
let students = [];
let horaries = [];

class course {
    constructor(code, name, speciality, duration, credits){
        this.code = code;
        this.name = name;
        this.speciality = speciality;
        this.duration = duration;
        this.credits = credits
    }

    modify_c(code_course, attributes){
        let index = ""
        for(let i = 0; i < courses.length; i++){
            if(courses[i].code == code_course){
                index = i
            }
        }
        courses[index].code = attributes[0].value
        courses[index].name = attributes[1].value
        courses[index].speciality = attributes[2].value
        courses[index].duration = attributes[3].value
        courses[index].credits = attributes[4].value

        for(let i = 0; i < students.length; i++){
            if(students[i].course.includes(code_course)){
                let index_s_c = students[i].course.indexOf(code_course)
                students[i].modify_s(i, index_s_c, attributes[0].value)
            }
        }

        for(let i = 0; i < horaries.length; i++){
            if(horaries[i].code_course == code_course){
                horaries[i].modify_h(i, attributes[0].value)
            }
        }

        show_courses()
    }

    delete_c(index){
        let course = courses[index].code
        for(let i = 0; i < horaries.length; i++){
            if(horaries[i].code_course == course){
                horaries[i].delete_h(i)
            }
        }
        courses.splice(index,1)
        show_courses()
    }

}

class student {
    constructor(code, name, career, course){
        this.code = code;
        this.name = name;
        this.career = career;
        this.course = [course];
    }

    modify_s(index_s, index_course, attribute){
        students[index_s].course.splice(index_course, 1, parseInt(attribute))
    }

    delete_s(index, code_course){
        let student = students[index].code
        for(let i = 0; i < horaries.length; i++){
            if(horaries[i].code_student == student){
                horaries[i].delete_h(i)
            }
        }
        students.splice(index,1)
        show_students(code_course)
    }
}

class horary {
    constructor(code_course, code_student, day, hour_init, hour_finish){
        this.code_course = code_course;
        this.code_student = code_student;
        this.day = day;
        this.hour_init = hour_init;
        this.hour_finish = hour_finish
    }

    modify_h(index_h, attribute){
        horaries[index_h].code_course = attribute
    }

    delete_h(index){
        horaries.splice(index,1)
    }
}

let my_course = new course(123, "curso 1", "especialidad", 25, 5)
courses.push(my_course)

let new_student = new student(321, "Pepito Perez", "Psicologia", 123)
students.push(new_student)

new_student = new student(3212, "Manuel Garcia", "Psicologia", 123)
students.push(new_student)

new_student = new student(3215, "Camila Perez", "Psicologia", 123)
students.push(new_student)

let new_horary = new horary(123, 321, "tuesday", "12:00", "14:00")
horaries.push(new_horary)

function save_course(){
    let code = document.getElementById("code").value;
    let name = document.getElementById("name").value;
    let speciality = document.getElementById("speciality").value;
    let duration = document.getElementById("duration").value;
    let credits = document.getElementById("credits").value;

    let contain = document.getElementById("add_course")
    let inputs = contain.querySelectorAll("input")
    let confirm = true
    inputs.forEach(input => {
        if (input.value.trim() == ""){
            confirm = false
        }
    });

    if(duration <= 0 || credits <= 0){
        alert("La duracion o los creditos no deben ser cero o negativos")
    }else{
        if (confirm){
            let my_course = new course(code, name, speciality, duration, credits);
            courses.push(my_course);
            inputs.forEach(input => {
                input.value = ""
            });
            show_courses();
        }else{
            alert("No dejes campos vacios")
        }
    }    
}

function show_courses(){
    let contain = document.getElementById("show_courses");
    contain.innerHTML = "";
    for (let i = 0; i < courses.length; i++){
        contain.innerHTML += `
        <div class="accordion-item">
            <h2 class="accordion-header accordion-style">
                <button class="accordion-button collapsed accordion-style" type="button" data-bs-toggle="collapse" data-bs-target="#course${i}" aria-expanded="false" aria-controls="flush-collapseOne">
                    ${courses[i].name}
                </button>
            </h2>
            <div id="course${i}" class="accordion-collapse collapse" data-bs-parent="#show_courses">
                <div class="accordion-body">
                    <div class="data_course">
                        <p><b>Codigo:</b> ${courses[i].code}</p>
                        <p><b>Especialidad:</b> ${courses[i].speciality}</p>
                        <p><b>Duracion:</b> ${courses[i].duration}</p>
                        <p><b>Creditos:</b> ${courses[i].credits}</p>
                    </div>
                    
                    <div class="button_course">
                        <button onclick="show_students(${courses[i].code})">Ver inscritos</button>
                        <button onclick="window.modal${i}.showModal()">Inscribir Estudiante</button>
                        <button onclick="window.modal_course.showModal(), modify_modal_course(${courses[i].code})">Modificar</button>
                        <button onclick="delete_course(${courses[i].code})">Eliminar curso</button>
                    </div>
                    <dialog class="modal_student" id="modal${i}">
                        <h2><b>Inscribir Estudiante</b></h2>
                        <label for="">Codigo</label>
                        <input type="number" id="code_student">
                        <label for="">Nombre</label>
                        <input type="text" id="name_student">
                        <button onclick="add_student(${courses[i].code}, ${i});">Guardar</button>
                        <button onclick="window.modal${i}.close();">Cerrar</button>
                    </dialog>
                    
                    <div class="content_info_s" id="students${courses[i].code}">
                        <div class="info_students" id="header${courses[i].code}"></div>
                        <div class="content_students" id="content${courses[i].code}"></div>
                    </div>
                </div>
            </div>
        </div>
        `
    }
}

function modify_modal_course(code_course){
    let modal = document.getElementById("modal_course")
    let buttons = modal.querySelectorAll("button")
    buttons[0].setAttribute("onclick", `modify_course(${code_course})`)
}

function modify_course(code_course){
    let modal = document.getElementById("modal_course")
    let inputs = modal.querySelectorAll("input")
    let course = ""
        for(let i = 0; i < courses.length; i++){
            if(courses[i].code == code_course){
                course = courses[i]
            }
        }

    let confirm = true
    inputs.forEach(input => {
        if (input.value.trim() == ""){
            confirm = false
        }
    });

    if(inputs[3].value <= 0 || inputs[4].value <= 0){
        alert("La duracion o los creditos no deben ser cero o negativos")
    }else{
        if (confirm){
            course.modify_c(code_course, inputs);
            inputs.forEach(input => {
                input.value = ""
            });
            modal.close()
        }else{
            alert("No dejes campos vacios")
        }
    } 
}

function delete_course(code_course){
    let course = ""
    let index = ""
    if (confirm("Deseas eliminar el curso?")){
        for(let i = 0; i < courses.length; i++){
            if(courses[i].code = code_course){
                course = courses[i]
                index = i
            }
        }
        course.delete_c(index)
    }
}

function add_student(code_career, index){
    let code = document.getElementById("code_student").value;
    let name = document.getElementById("name_student").value;
    let modal = document.querySelector("#modal" + index);
    if (code.trim() == "" || name.trim() == ""){
        alert("No dejes campos vacios")
    }else{
        let new_student = new student(code, name, "Psicologia", code_career)
        students.push(new_student);
    
        let inputs = modal.querySelectorAll("input")
        inputs.forEach(input => {
            input.value = ""
        });
        modal.close()
        show_students(code_career)
    }
    
}

function show_students(code_course){
    let header = document.getElementById("header" + code_course)
    let contain = document.getElementById("content" + code_course)
    contain.innerHTML = "";
    header.innerHTML = `
        <p>Eliminar</p>
        <p>Codigo</p>
        <p>Estudiantes</p>
        <p>Lunes</p>
        <p>Martes</p>
        <p>Miercoles</p>
        <p>Jueves</p>
        <p>Viernes</p>
        <p>Sabado</p>
        <p>Domingo</p>
    `
    for (let i = 0; i < students.length; i++){
        if(students[i].course.includes(code_course)){
            contain.innerHTML += `
            <div id = "${students[i].code}" class = "info_student">
                <div>
                <button onclick="delete_student(${i}, ${code_course})" class = "button_delete">X</button>
                </div>    
            
                <p>${students[i].code}</p>
                <p>${students[i].name}</p>
                <div class="monday">
                    <button data-id="1" onclick="show_modal_hour(${i}, this)">Añadir horario</button>
                </div>
                <div class="tuesday">
                    <button data-id="2" onclick="show_modal_hour(${i}, this)">Añadir horario</button>
                </div>
                <div class="wednesday">
                    <button data-id="3" onclick="show_modal_hour(${i}, this)">Añadir horario</button>
                </div>
                <div class="thursday">
                    <button data-id="4" onclick="show_modal_hour(${i}, this)">Añadir horario</button>
                </div>
                <div class="friday">
                    <button data-id="5" onclick="show_modal_hour(${i}, this)">Añadir horario</button>
                </div>
                <div class="saturday">
                    <button data-id="6" onclick="show_modal_hour(${i}, this)">Añadir horario</button>
                </div>
                <div class="sunday">
                    <button data-id="7" onclick="show_modal_hour(${i}, this)">Añadir horario</button>
                </div>
            </div>
            `
        }
    }
    show_horaries()
}

function show_modal_hour(i_student, button){
    let modal = document.getElementById("modal_horary")
    modal.showModal();
    let name = modal.querySelector("h3")
    name.textContent = students[i_student].name

    let day = button.getAttribute("data-id")

    let father = button.parentElement
    let father_f = father.parentElement
    let code_student = father_f.getAttribute("id")
    
    let i_course = ""

    for(let i = 0; i < courses.length; i++){
        if(students[i_student].course.includes(courses[i].code)){
            i_course = i
        }
    }

    let b_save = modal.querySelector("#save_horary")
    b_save.setAttribute("onclick", `add_horary(${day},${code_student},${i_course})`)
}

function add_horary(day, code_student, i_course){
    let modal = document.getElementById("modal_horary")
    let hour_init = modal.querySelector("#hour_init").value
    let hour_finish = modal.querySelector("#hour_finish").value

    if (day == 1){
        day = "monday";
    } 
    if(day == 2){
        day = "tuesday";
    } 
    if(day == 3){
        day = "wednesday";
    } 
    if(day == 4){
        day = "thursday";
    } 
    if(day == 5){
        day = "friday";
    } 
    if(day == 6){
        day = "saturday";
    } 
    if(day == 7){
        day = "sunday";
    }

    if(hour_init.trim() == "" || hour_finish.trim() == ""){
        alert("No dejes campos vacios")
    }else{
        let new_horary = new horary(courses[i_course].code, code_student, day, hour_init, hour_finish) 
        horaries.push(new_horary);

        let inputs = modal.querySelectorAll("input")
        inputs.forEach(input => {
            input.value = ""
        });

        show_horaries()
        modal.close()
    }
}

function show_horaries(){
    for (let i = 0; i < horaries.length; i++){
        let contain = document.getElementById(horaries[i].code_student)
        let id_day = "." + horaries[i].day
        let day = contain.querySelector(id_day)
        day.innerHTML = `
        <p>Inicio: <br>${horaries[i].hour_init}</p>
        <p>Fin: <br>${horaries[i].hour_finish}</p>
        `
    }
}

function delete_student(index, code_course){
    if(confirm("Desea eliminar el estudiante?")){
        let student = students[index]
        student.delete_s(index, code_course)
    }
}

window.addEventListener("load", function (){
    show_courses()
})

