const express=require('express');
const {buildSchema}=require('graphql');
const graphqlHTTP= require('express-graphql');
const app=express();

const courses=require('./courses');

const schema=buildSchema(`
    type Course{
      id:ID!
      title:String!
      views:Int
    }

    type Alert{
      message:String
    }
    input CourseInput{
      title:String!
      views:Int
    }
    type Query{
      getCourses:[Course]
      getCourse(id:ID!):Course
    }
    type Mutation{
      addCourse(input:CourseInput):Course
      updateCourse(id:ID!,input:CourseInput):Course
      deleteCourse(id:ID!):Alert
    }
`);

const root={
  getCourses(){
    return courses;
  },
  getCourse({id}){
    console.log(id);
    return courses.find((course)=>id==course.id);
  },
  addCourse({input}){
    const{title,views}=input;
      const id=String(courses.length+1);
      const course={id,title,views};
      courses.push(course);
      return course;
  },
  updateCourse({input}){
    const courseIndex=courses.findIndex((course)=>id===course.id);
    const course=courses[courseIndex];

    const newCourse=Object.assign(course,input);
    course[courseIndex]=newCourse;
    return newCourse;
  },
  deleteCourse({id}){
    courses=courses.filter((course)=>course.id!=id);
    return{
      message:`El curso con id ${id} fue eliminado`
    }
  }
}


app.get('/',function(req,res){
  //res.send("Bienvenido");
  res.json(courses);
});
//middleware
app.use('/graphql',graphqlHTTP({
  schema:schema,
  rootValue:root,
  graphiql:true
}));
app.listen(8080,function(){
  console.log("Servidor iniciado");
});
