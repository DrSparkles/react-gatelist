import chai from 'chai';
import { clearAllAndLoad } from '../../fixtures';
const should = chai.should();

import Tasks from '../../../modules/tasks.js';

describe('Tasks', function() {

  before(function(done){
    clearAllAndLoad(function(err){
      if (err){
        console.log(err);
        return done(err);
      }

      return done(null);
    })
  });

  it('getListTasks should return all tasks from a list', function(done){

    const listId = '5ab0d2f5528adc08f0412184';
    Tasks.getListTasks(listId, function(err, docs){
      if (err) { return done(err); }

      docs.error.should.be.false;
      docs.result.should.be.instanceof(Array);
      docs.result[0].tasks.should.be.instanceof(Array);
      docs.result[0].tasks[0].taskname.should.equal('Great Task');

      return done(null);
    });
  });

  it('getListTasks should return nothing if list id is not recognized', function(done){

    const listId = '5ab0d2d4528adc08f0123456';
    Tasks.getListTasks(listId, function(err, docs){
      if (err) { return done(err); }

      docs.error.should.be.false;
      docs.result.should.be.instanceof(Array);
      docs.result.should.have.length(0);

      return done(null);
    });
  });

  it('getListTasks should should error if no list id is passed in', function(done){

    const listId = '';
    Tasks.getListTasks(listId, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a list id to fetch their entries.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('getTask should return a specific list given an id', function(done){

    const taskId = '5ab0d316528adc08f0412185';
    Tasks.getTask(taskId, function(err, docs){
      if (err) { return done(err); }

      docs.error.should.be.false;

      docs.result.should.be.instanceof(Array);
      docs.result[0].tasks.should.be.instanceof(Array);
      docs.result[0].tasks.should.have.length(1);
      docs.result[0].tasks[0].taskname.should.equal('Great Task');

      return done(null);
    });
  });


  it('getTask should return nothing given an unrecognized list id', function(done){

    const listId = '5ab0d2f5528adc08f0123456';
    Tasks.getTask(listId, function(err, docs){
      if (err) { return done(err); }

      docs.error.should.be.false;

      docs.result.should.be.instanceof(Array);
      docs.result.should.have.length(0);

      return done(null);
    });
  });

  it('getTask should error if no list id is passed in', function(done){

    const listId = "";
    Tasks.getTask(listId, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a task id to fetch the entries.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('createNew should create a new entry', function(done){
    const listId = '5ab0d2f5528adc08f0412184';

    const taskValues = {
      taskname: "Created Task",
      duedate: "",
      notes: "",
      completed: false
    };

    Tasks.getListTasks(listId, function(err, docs){
      if (err) { return done(err); }

      docs.error.should.be.false;

      docs.result.should.be.instanceof(Array);

      const taskCount = docs.result[0].tasks.length;

      Tasks.createNew(listId, taskValues, function(err, docs){
        if (err) { return done(err); }

        docs.error.should.be.false;
        docs.result.n.should.equal(1);

        Tasks.getListTasks(listId, function(err, docs){
          if (err) { return done(err); }

          docs.error.should.be.false;

          docs.result.should.be.instanceof(Array);
          docs.result[0].tasks.should.have.length(taskCount + 1);

          return done(null);
        });
      });
    });
  });

  it('createNew should error if no task name is passed in', function(done){

    const listId = '5ab0d2f5528adc08f0412184';
    const taskValues = {
      taskname: "",
      duedate: "",
      notes: "",
      completed: false
    };

    Tasks.createNew(listId, taskValues, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a task name to create a new entry.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('createNew should error if the due date field is missing from the object', function(done){

    const listId = '5ab0d2f5528adc08f0412184';
    const taskValues = {
      taskname: "Fancy Task",
      notes: "",
      completed: false
    };

    Tasks.createNew(listId, taskValues, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a task duedate field in the task, even if blank, to create a new entry.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('createNew should error if the notes field is missing from the object', function(done){

    const listId = '5ab0d2f5528adc08f0412184';
    const taskValues = {
      taskname: "Fancy Task",
      duedate: "",
      completed: false
    };

    Tasks.createNew(listId, taskValues, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a task notes field in the task, even if blank, to create a new entry.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('createNew should error if the completed field is missing from the object', function(done){

    const listId = '5ab0d2f5528adc08f0412184';
    const taskValues = {
      taskname: "Fancy Task",
      duedate: "",
      notes: "",
    };

    Tasks.createNew(listId, taskValues, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a task completed field in the task, even if blank, to create a new entry.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('createNew should concat errors if the several things are missing', function(done){

    const listId = '5ab0d2f5528adc08f0412184';
    const taskValues = {
      taskname: "Fancy Task",
      notes: "",
    };

    Tasks.createNew(listId, taskValues, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a task duedate field in the task, even if blank, to create a new entry.,Must have a task completed field in the task, even if blank, to create a new entry.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('updateTask task name should change that task name', function(done){
    const taskId = '5ab0d316528adc08f0412185'; // task id from fixtures
    const taskValues = {
      taskname: "Updated task name",
      duedate: "",
      notes: "",
      completed: false
    };

    Tasks.updateTask(taskId, taskValues, function(err, updateDocs){
      if (err) { return done(err); }
      // result should return number edited, which should be 1...
      updateDocs.error.should.be.false;

      // and check that the name actually changed...
      Tasks.getTask(taskId, function(err, docs){
        if (err) { return done(err); }

        docs.error.should.be.false;
        docs.result.should.be.instanceof(Array);
        docs.result[0].tasks.should.be.instanceof(Array);
        docs.result[0].tasks[0].taskname.should.equal(taskValues.taskname);

        return done(null);
      });
    });
  });

  it('updateTask task duedate should change that task duedate', function(done){
    const taskId = '5ab0d316528adc08f0412185'; // task id from fixtures
    const taskValues = {
      taskname: "Updated task name",
      duedate: "2020-01-01",
      notes: "",
      completed: false
    };

    Tasks.updateTask(taskId, taskValues, function(err, updateDocs){
      if (err) { return done(err); }
      // result should return number edited, which should be 1...
      updateDocs.error.should.be.false;

      // and check that the name actually changed...
      Tasks.getTask(taskId, function(err, docs){
        if (err) { return done(err); }

        docs.error.should.be.false;
        docs.result.should.be.instanceof(Array);
        docs.result[0].tasks.should.be.instanceof(Array);
        docs.result[0].tasks[0].duedate.should.equal(taskValues.duedate);

        return done(null);
      });
    });
  });

  it('updateTask task notes should change that task notes', function(done){
    const taskId = '5ab0d316528adc08f0412185'; // task id from fixtures
    const taskValues = {
      taskname: "Updated task name",
      duedate: "",
      notes: "Super Notes",
      completed: false
    };

    Tasks.updateTask(taskId, taskValues, function(err, updateDocs){
      if (err) { return done(err); }
      // result should return number edited, which should be 1...
      updateDocs.error.should.be.false;

      // and check that the name actually changed...
      Tasks.getTask(taskId, function(err, docs){
        if (err) { return done(err); }

        docs.error.should.be.false;
        docs.result.should.be.instanceof(Array);
        docs.result[0].tasks.should.be.instanceof(Array);
        docs.result[0].tasks[0].notes.should.equal(taskValues.notes);

        return done(null);
      });
    });
  });

  it('updateTask task completed should change that task completed', function(done){
    const taskId = '5ab0d316528adc08f0412185'; // task id from fixtures
    const taskValues = {
      taskname: "Updated task name",
      duedate: "",
      notes: "",
      completed: true
    };

    Tasks.updateTask(taskId, taskValues, function(err, updateDocs){
      if (err) { return done(err); }
      // result should return number edited, which should be 1...
      updateDocs.error.should.be.false;

      // and check that the name actually changed...
      Tasks.getTask(taskId, function(err, docs){
        if (err) { return done(err); }

        docs.error.should.be.false;
        docs.result.should.be.instanceof(Array);
        docs.result[0].tasks.should.be.instanceof(Array);
        docs.result[0].tasks[0].completed.should.equal(taskValues.completed);

        return done(null);
      });
    });
  });

  it('updateTask should error if no task name is passed in', function(done){

    const taskId = '5ab0d316528adc08f0412185'; // task id from fixtures
    const taskValues = {
      taskname: "",
      duedate: "",
      notes: "",
      completed: false
    };

    Tasks.updateTask(taskId, taskValues, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a task name to create a new entry.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('updateTask should error if the due date field is missing from the object', function(done){

    const taskId = '5ab0d316528adc08f0412185'; // task id from fixtures
    const taskValues = {
      taskname: "Fancy Task",
      notes: "",
      completed: false
    };

    Tasks.updateTask(taskId, taskValues, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a task duedate field in the task, even if blank, to create a new entry.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('updateTask should error if the notes field is missing from the object', function(done){

    const taskId = '5ab0d316528adc08f0412185'; // task id from fixtures
    const taskValues = {
      taskname: "Fancy Task",
      duedate: "",
      completed: false
    };

    Tasks.updateTask(taskId, taskValues, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a task notes field in the task, even if blank, to create a new entry.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('updateTask should error if the completed field is missing from the object', function(done){

    const taskId = '5ab0d316528adc08f0412185'; // task id from fixtures
    const taskValues = {
      taskname: "Fancy Task",
      duedate: "",
      notes: "",
    };

    Tasks.updateTask(taskId, taskValues, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a task completed field in the task, even if blank, to create a new entry.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('updateTask should concat errors if the several things are missing', function(done){

    const taskId = '5ab0d316528adc08f0412185'; // task id from fixtures
    const taskValues = {
      taskname: "Fancy Task",
      notes: "",
    };

    Tasks.updateTask(taskId, taskValues, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a task duedate field in the task, even if blank, to create a new entry.,Must have a task completed field in the task, even if blank, to create a new entry.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('deleteTask should remove a task', function(done){
    const listId = '5ab0d2f5528adc08f0412184';
    const taskId = '5ab1c18985e4d30bbc584cc5';
    // create a list to updated...
    Tasks.getListTasks(listId, function(err, docs){
      if (err) { return done(err); }

      docs.error.should.be.false;
      docs.result.should.be.instanceof(Array);
      docs.result[0].tasks.should.be.instanceof(Array);

      const taskCount = docs.result[0].tasks.length;

      // delete that list...
      Tasks.deleteTask(listId, taskId, function(err, deleteDocs){
        if (err) { return done(err); }

        // result should return number edited, which should be 1...
        deleteDocs.error.should.be.false;

        // and check that the name actually changed...
        Tasks.getListTasks(listId, function(err, dataCheckDocs){
          if (err) { return done(err); }

          dataCheckDocs.error.should.be.false;
          dataCheckDocs.result.should.be.instanceof(Array);
          dataCheckDocs.result[0].tasks.should.have.length(taskCount - 1);

          return done(null);
        });
      });
    });
  });

  it('deleteTask should error if there is no task id', function(done){

    const listId = '5ab0d2f5528adc08f0412184';
    const taskId = '';

    Tasks.deleteTask(listId, taskId, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a task id to delete the entries.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

  it('deleteTask should error if there is no list id', function(done){

    const listId = '';
    const taskId = '5ab0d2f5528adc08f0412184';

    Tasks.deleteTask(listId, taskId, function(err, docs){
      if (err) {
        err.should.be.instanceOf(Error);
        err.message.should.equal('Must have a list id to delete the entries.');
        err.status.should.equal(400);

        let isUndefined = false;
        if (docs === undefined){
          isUndefined = true;
        }

        isUndefined.should.be.true;

        return done(null);
      }

      return done(new Error("Test didn't fail as it should have"));
    });
  });

});