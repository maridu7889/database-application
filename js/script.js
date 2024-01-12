
const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const bodyParser = require('body-parser');




const app = express();

  

const connection = mysql.createConnection({
  host: 'mysql.b45e37fcaea.hosting.myjino.ru',
  user: 'j9463376_k13',
  database: 'j9463376_k13',
  password: 'Studs-Db-NSTU'
});
connection.connect();


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use(bodyParser.urlencoded({ extended: true }));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/', (req, res) => {
  res.render('full');  
});


app.get('/main', (req, res) => {
  res.render('main');  
});

app.get('/report', (req, res) => {
  res.render('report');  
});

app.get('/job', (req, res) => {
  res.render('job');  
});

app.get('/performers', (req, res) => {
  res.render('performers');  
});

app.get('/staff', (req, res) => {
  res.render('staff');  
});

app.get('/participants', (req, res) => {
  res.render('participants');  
});

app.get('/customers', (req, res) => {
  res.render('customers');  
});

app.get('/events', (req, res) => {
  res.render('events');  
});

app.get('/request', (req, res) => {
  res.render('request');  
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get('/getDataByMonth', (req, res) => {
  res.render('form_month');  
});


app.post('/get_table_by_month', (req, res) => {
  const month = req.body.month;
  const query = 'SELECT * FROM events WHERE MONTH(`start`) = ? AND `condition` = "carried" ';
  connection.query(query, [month], (error, results) => {
    if (error) {
      res.send('Ошибка получения данных из базы данных');
    } else {
      if (results.length === 0){

      res.render('form_month', {warning: 'Проведенных мероприятий в этом месяце нет. Мероприятие либо было перенесено, либо запланировано, либо отменено'});

    } else {
      res.render('table', { data: results });  
    }
  }
  });
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/getDataByJob', (req, res) => {
    res.render('formjob');  
  });

  app.post('/get_table_by_job', (req, res) => {
    const jobtitle = req.body.jobtitle;
    const query = 'SELECT * FROM positions WHERE jobtitle= ?';
    connection.query(query, [jobtitle], (error, results) => {
      if (error) {
        res.send('Ошибка получения данных из базы данных');
      } else {
        res.render('tablejob', { data: results });  
      }
    });
  });
  
  

app.get('/addJob', (req, res) => {
    res.render('add_job_form'); 
  });
  
 
  app.post('/saveJob', (req, res) => {
    const jobtitle = req.body.jobtitle;
    const wages = req.body.wages;

    if (wages <= 0 ) {
      return res.status(400).send('Зарплата не может быть отрицательной');
    } else{
  
    const query = 'INSERT INTO positions (jobtitle, wages) VALUES (?, ?)';
    connection.query(query, [jobtitle, wages], (error, results) => {
      if (error) {
        console.error('Ошибка базы данных:', error);
        res.send('Ошибка добавления данных в базу данных');
      } else {
        
        res.redirect('/job'); 
      }
    });
   }  
  });

  app.get('/employeeCodeForm', (req, res) => {
    res.render('employeeCodeForm'); 
  });



app.post('/editJob', (req, res) => {
  const jobtitle = req.body.jobtitle;

  const query = 'SELECT * FROM positions WHERE jobtitle = ?';
  connection.query(query, [jobtitle], (error, results) => {
    if (error) {
      console.error('Ошибка базы данных:', error);
      
      res.status(500).send('Ошибка получения данных из базы данных: ' + error);
    } else {
      if (results.length === 0) {
        
        res.send('Нет записи в базе данных');
      }
      res.render('edit_job_form', { employee: results[0] }); 
    }
  });
});


app.post('/deleteJob', (req, res) => {
  const jobtitle = req.body.jobtitle;

  const query = 'DELETE FROM positions WHERE jobtitle = ?';
  connection.query(query, [jobtitle], (error, results) => {
    if (error) {
      res.send('Ошибка удаления данных из базы данных');
    } else {
      
      res.redirect('/job');
    }
  });
});

app.post('/updateJob', (req, res) => {
  const jobtitle = req.body.jobtitle;
  const wages = req.body.wages;
  

  
const updateQuery = 'UPDATE positions SET wages = ? WHERE jobtitle = ?';

const selectQuery = 'SELECT * FROM positions WHERE jobtitle = ?';

connection.query(updateQuery, [wages, jobtitle], (error) => {
  if (error) {
    res.send('Ошибка обновления данных в базе данных');
  } else {
    
    connection.query(selectQuery, [jobtitle], (err, updatedResults) => {
      if (err) {
        res.send('Ошибка при попытке получить обновленные данные из базы данных');
      } else {
        
        res.render('edit_job_form', { employee: updatedResults[0] });
      }
    });
  }
});

});

 
  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/getDataPerformes', (req, res) => {
    res.render('formpermormes');  
  });

  app.post('/get_table_by_permormes', (req, res) => {
    const employeecode = req.body.employeecode;
    const query = 'SELECT * FROM performers WHERE employeecode= ?';
    connection.query(query, [employeecode], (error, results) => {
      if (error) {
        res.send('Ошибка получения данных из базы данных');
      } else {
        res.render('tableperformers', { data: results });  
      }
    });
  });

  app.get('/addPerformers', (req, res) => {
    res.render('add_performers_form'); 
  });
  
 
  app.post('/savePerformers', (req, res) => {
    const employeecode = req.body.employeecode;
    const eventcode = req.body.eventcode;
    const eventname = req.body.eventname;
    const start = req.body.start;
    const end = req.body.end;

    if (new Date(start).getTime() >= new Date(end).getTime()) { 
      return res.status(400).send('Дата начала должна быть меньше даты окончания'); 
    } else {
  
    const query = 'INSERT INTO performers (employeecode, eventcode, eventname, start, end) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [employeecode, eventcode, eventname, start, end], (error, results) => {
      if (error) {
        console.error('Ошибка добавления данных в базу данных', error);
        res.send('Ошибка добавления данных в базу данных');
      } else {
        
        res.redirect('/performers'); 
      }
    });
  }
  });
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  app.get('/performersCodeForm', (req, res) => {
    res.render('performersCodeForm'); 
  });

  app.post('/editperformers', (req, res) => {
    const employeecode = req.body.employeecode;
  
    const query = 'SELECT * FROM performers WHERE employeecode = ?';
    connection.query(query, [employeecode], (error, results) => {
      if (error) {
        res.send('Ошибка получения данных из базы данных');
      } else {
        if (results.length === 0) {
          
          res.send('Нет записи в базе данных');
        }
        console.log(results[0]);
        res.render('edit_performers_form', { employee: results[0] });
      }
    });
  });
  
  
  app.post('/deleteperformers', (req, res) => {
    const employeecode = req.body.employeecode;
    console.log('employeecode:', employeecode); 
  
    const query = 'DELETE FROM performers WHERE employeecode = ?';
    connection.query(query, [employeecode], (error, results) => {
      if (error) {
        console.error('Ошибка базы данных:', error); 
        res.send('Ошибка удаления данных из базы данных');
      } else {
        
        res.redirect('/performers');
      }
    });
  });
  
  app.post('/updateperformers', (req, res) => {
    const eventcode = req.body.eventcode;
    const employeecode = req.body.employeecode;
    const eventname = req.body.eventname;
    const start = req.body.start;
    const end = req.body.end;
    console.log('employeecode:',  'eventcode:', 'eventname:', 'start:', 'end:', employeecode, eventcode,eventname, start,  end); // Отобразим значение employeecode в консоли
    
    
  
    
  const updateQuery = 'UPDATE performers SET employeecode = ?, eventname = ?, start = ?, end = ?  WHERE eventcode = ?';
  
  const selectQuery = 'SELECT * FROM performers WHERE employeecode = ?';
  
  connection.query(updateQuery, [employeecode, eventname, start, end, eventcode], (error) => {
    if (error) {
      console.error('Ошибка базы данных:', error); 
      res.send('Ошибка обновления данных в базе данных');

    } else {
      
      connection.query(selectQuery, [employeecode], (err, updatedResults) => {
        if (err) {
          res.send('Ошибка при попытке получить обновленные данные из базы данных');
        } else {
          
          res.render('edit_performers_form', { employee: updatedResults[0] });
        }
      });
    }
  });
  
  });
  
   
////// //// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/getDataStaff', (req, res) => {
    res.render('formstaff');  
  });

  app.post('/get_table_by_staff', (req, res) => {
    const employeecode = req.body.employeecode;
    const query = 'SELECT * FROM staff WHERE employeecode= ?';
    connection.query(query, [employeecode], (error, results) => {
      if (error) {
        res.send('Ошибка получения данных из базы данных');
      } else {
        res.render('tablestaff', { data: results });  
      }
    });
  });



  app.get('/addStaff', (req, res) => {
    res.render('add_staff_form'); 
  });
  
  
  app.post('/saveStaff', (req, res) => {
    const employeecode = req.body.employeecode;
    const post = req.body.post;
    const telephone = req.body.telephone;
    
    const additionalinformation = req.body.additionalinformation;
    const name = req.body.name;
    const lastname = req.body.lastname;
    const patronymic = req.body.patronymic;
  
    const query = 'INSERT INTO staff (employeecode, post, telephone, additionalinformation, name, lastname, patronymic) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [employeecode, post, telephone, additionalinformation, name, lastname, patronymic], (error, results) => {
      if (error) {
        res.send('Ошибка добавления данных в базу данных');
      } else {
        
        res.redirect('/staff'); 
      }
    });
  });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/staffCodeForm', (req, res) => {
  res.render('staffCodeForm'); 
});

app.post('/editstaff', (req, res) => {
  const employeecode = req.body.employeecode;

  const query = 'SELECT * FROM staff WHERE employeecode = ?';
  connection.query(query, [employeecode], (error, results) => {
    if (error) {
      res.send('Ошибка получения данных из базы данных');
    } else {
      if (results.length === 0) {
        
        res.send('Нет записи в базе данных');
      }
      console.log(results[0]);
      res.render('edit_staff_form', { employee: results[0] }); 
    }
  });
});


app.post('/deletestaff', (req, res) => {
  const employeecode = req.body.employeecode;
  console.log('employeecode:', employeecode); 

  const query = 'DELETE FROM staff WHERE employeecode = ?';
  connection.query(query, [employeecode], (error, results) => {
    if (error) {
      console.error('Ошибка базы данных:', error); 
      res.send('Ошибка удаления данных из базы данных');
    } else {
      
      res.redirect('/staff');
    }
  });
});

app.post('/updatestaff', (req, res) => {
  
  const employeecode = req.body.employeecode;
  const post = req.body.post;
  const telephone = req.body.telephone;
  
  const additionalinformation = req.body.additionalinformation;
  const name = req.body.name;
  const lastname = req.body.lastname;
  const patronymic = req.body.patronymic;
  
  
  

  
const updateQuery = 'UPDATE staff SET post = ?, telephone = ?,  additionalinformation = ?, name = ?, lastname = ?, patronymic = ?  WHERE employeecode = ?';

const selectQuery = 'SELECT * FROM staff WHERE employeecode = ?';

connection.query(updateQuery, [ post, telephone,  additionalinformation, name, lastname, patronymic, employeecode], (error) => {
  if (error) {
    
    
    console.error('Ошибка базы данных:', error); 
    res.send('Ошибка обновления данных в базе данных');

  } else {
    
    
    connection.query(selectQuery, [employeecode], (err, updatedResults) => {
      if (err) {
        res.send('Ошибка при попытке получить обновленные данные из базы данных');
      } else {
        
        
        res.render('edit_staff_form', { employee: updatedResults[0] });
      }
    });
  }
});

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/getDataParticipants', (req, res) => {
  res.render('formparticipants');  
});

app.post('/get_table_by_participants', (req, res) => {
  const eventcode = req.body.eventcode;
  const query = 'SELECT * FROM participants WHERE eventcode= ?';
  connection.query(query, [eventcode], (error, results) => {
    if (error) {
      res.send('Ошибка получения данных из базы данных');
    } else {
      res.render('tableparticipants', { data: results });  
    }
  });
});



app.get('/addParticipants', (req, res) => {
  res.render('add_participants_form'); 
});


app.post('/saveParticipants', (req, res) => {
  const participantcode = req.body.participantcode;
  const FIO = req.body.FIO;
  const gender = req.body.gender;
  const age = req.body.age;
  const socialstatus = req.body.socialstatus;
  const eventcode = req.body.eventcode;
  const additionalinformation = req.body.additionalinformation;
  const customercode = req.body.customercode;
  const startdate = req.body.startdate;

  const query = 'INSERT INTO participants (participantcode, FIO, gender, age, socialstatus, eventcode, additionalinformation, customercode, startdate ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [participantcode, FIO, gender, age, socialstatus, eventcode, additionalinformation, customercode, startdate], (error, results) => {
    if (error) {
      console.error('Ошибка базы данных:', error); 
      res.send('Ошибка добавления данных в базу данных');
    } else {
      
      res.redirect('/participants'); 
    }
  });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/participantsCodeForm', (req, res) => {
res.render('participantsCodeForm'); 
});

app.post('/editparticipants', (req, res) => {
const participantcode = req.body.participantcode;

const query = 'SELECT * FROM participants WHERE participantcode = ?';
connection.query(query, [participantcode], (error, results) => {
  if (error) {
    res.send('Ошибка получения данных из базы данных');
  } else {
    if (results.length === 0) {
      
      res.send('Нет записи в базе данных');
    }
    console.log(results[0]);
    res.render('edit_participants_form', { employee: results[0] }); 
  }
});
});


app.post('/deleteparticipants', (req, res) => {
const participantcode = req.body.participantcode;
console.log('participantcode:', participantcode); 

const query = 'DELETE FROM participants WHERE participantcode = ?';
connection.query(query, [participantcode], (error, results) => {
  if (error) {
    console.error('Ошибка базы данных:', error); 
    res.send('Ошибка удаления данных из базы данных');
  } else {
    
    res.redirect('/participants');
  }
});
});

app.post('/updateparticipants', (req, res) => {

const participantcode = req.body.participantcode;
const FIO = req.body.FIO;
const gender = req.body.gender;
const age = req.body.age;
const socialstatus = req.body.socialstatus;
const eventcode = req.body.eventcode;
const additionalinformation = req.body.additionalinformation;
const customercode = req.body.customercode;
const startdate = req.body.startdate;





const updateQuery = 'UPDATE participants SET FIO = ?, gender = ?, age = ?, socialstatus = ?, eventcode = ?, additionalinformation = ?, customercode = ?, startdate = ?  WHERE participantcode = ?';

const selectQuery = 'SELECT * FROM participants WHERE participantcode = ?';

connection.query(updateQuery, [ FIO, gender, age,  socialstatus, eventcode, additionalinformation, customercode, startdate, participantcode], (error) => {
if (error) {
  
  
  console.error('Ошибка базы данных:', error); 
  res.send('Ошибка обновления данных в базе данных');

} else {
  
  
  connection.query(selectQuery, [participantcode], (err, updatedResults) => {
    if (err) {
      res.send('Ошибка при попытке получить обновленные данные из базы данных');
    } else {
      
      
      res.render('edit_participants_form', { employee: updatedResults[0] });
    }
  });
}
});

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/getDataCustomers', (req, res) => {
  res.render('formcustomers');  
});

app.post('/get_table_by_customers', (req, res) => {
  const customercode = req.body.customercode;
  const query = 'SELECT * FROM customers WHERE customercode= ?';
  connection.query(query, [customercode], (error, results) => {
    if (error) {
      res.send('Ошибка получения данных из базы данных');
    } else {
      res.render('tablecustomers', { data: results });  
    }
  });
});



app.get('/addCustomers', (req, res) => {
  res.render('add_customers_form'); 
});


app.post('/saveCustomers', (req, res) => {
  const customercode = req.body.customercode;
  
  const director = req.body.director;
  const contactperson = req.body.contactperson;
  const address = req.body.address;
  
  const email = req.body.email;
  const additionalinformation = req.body.additionalinformation;
  const companyname = req.body.companyname;
  const telephone = req.body.telephone;
  

  const query = 'INSERT INTO customers (customercode, director, contactperson, address, email, additionalinformation, companyname,telephone ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [customercode,  director, contactperson, address,  email, additionalinformation, companyname, telephone], (error, results) => {
    if (error) {
      console.error('Ошибка базы данных:', error); 
      res.send('Ошибка добавления данных в базу данных');
    } else {
      
      res.redirect('/customers'); 
    }
  });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/customersCodeForm', (req, res) => {
res.render('customersCodeForm'); 
});

app.post('/editcustomers', (req, res) => {
const customercode = req.body.customercode;

const query = 'SELECT * FROM customers WHERE customercode = ?';
connection.query(query, [customercode], (error, results) => {
  if (error) {
    res.send('Ошибка получения данных из базы данных');
  } else {
    if (results.length === 0) {
      
      res.send('Нет записи в базе данных');
    }
    console.log(results[0]);
    res.render('edit_customers_form', { employee: results[0] }); 
  }
});
});


app.post('/deletecustomers', (req, res) => {
const customercode = req.body.customercode;
console.log('customercode:', customercode); 

const query = 'DELETE FROM customers WHERE customercode = ?';
connection.query(query, [customercode], (error, results) => {
  if (error) {
    console.error('Ошибка базы данных:', error); 
    res.send('Ошибка удаления данных из базы данных');
  } else {
    
    res.redirect('/customers');
  }
});
});

app.post('/updatecustomers', (req, res) => {

  const customercode = req.body.customercode;
  
  const director = req.body.director;
  const contactperson = req.body.contactperson;
  const address = req.body.address;
  
  const email = req.body.email;
  const additionalinformation = req.body.additionalinformation;
  const companyname = req.body.companyname;
  const telephone = req.body.telephone;






const updateQuery = 'UPDATE customers SET  director = ?, contactperson = ?, address = ?,  email = ?, additionalinformation = ?, companyname = ?, telephone = ?  WHERE customercode = ?';

const selectQuery = 'SELECT * FROM customers WHERE customercode = ?';

connection.query(updateQuery, [ director, contactperson,  address, email,  additionalinformation, companyname, telephone, customercode], (error) => {
if (error) {
  
  
  console.error('Ошибка базы данных:', error); 
  res.send('Ошибка обновления данных в базе данных');

} else {
  
  
  connection.query(selectQuery, [customercode], (err, updatedResults) => {
    if (err) {
      res.send('Ошибка при попытке получить обновленные данные из базы данных');
    } else {
      
      
      res.render('edit_customers_form', { employee: updatedResults[0] });
    }
  });
}
});

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/getDataEvents', (req, res) => {
  res.render('formevents');  
});

app.post('/get_table_by_events', (req, res) => {
  const eventcode = req.body.eventcode;
  const query = 'SELECT * FROM events WHERE eventcode= ?';
  connection.query(query, [eventcode], (error, results) => {
    if (error) {
      res.send('Ошибка получения данных из базы данных');
    } else {
      res.render('tableevents', { data: results });  
    }
  });
});



app.get('/addEvents',  (req, res) => {
  res.render('add_events_form'); 
});


app.post('/saveEvents', (req, res) => {
  const eventcode = req.body.eventcode;
  const eventname = req.body.eventname;
  const eventtypecode = req.body.eventtypecode;
  const dateofapproval = req.body.dateofapproval;
  const descriptionoftheevent = req.body.descriptionoftheevent;
  const employeecode = req.body.employeecode;
  const condition = req.body.condition;
  const venue = req.body.venue;
  const plannedexpenses = req.body.plannedexpenses;
  const actualexpenses = req.body.actualexpenses;
  const plannednumberP = req.body.plannednumberP;
  const actualnumberP = req.body.actualnumberP;
  const customercode = req.body.customercode;
  const start = req.body.start;
  const end = req.body.end;

  if (new Date(start) >= new Date(end)) {
    return res.status(400).send('Дата начала должна быть меньше даты окончания');
  } else if (actualexpenses <= 0) {
    return res.status(400).send('Фактические расходы должны быть больше нуля');  
  } else if (plannedexpenses <= 0) {
    return res.status(400).send('Планируемые расходы должны быть больше нуля');  
  }else if (plannednumberP <= 0) {
    return res.status(400).send('Планируемое кол-во учатников  должно быть больше нуля');  
  }else if (actualnumberP <= 0) {
    return res.status(400).send('Фактическое кол-во учатников  должно быть больше нуля');  
  } else {
    const query = 'INSERT INTO events (eventcode, eventname,  eventtypecode, dateofapproval, descriptionoftheevent, employeecode, `condition`, venue, plannedexpenses, actualexpenses, plannednumberP, actualnumberP, customercode, start, end) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  
  console.time('Запрос в базу данных');
  connection.query(query, [eventcode, eventname, eventtypecode, dateofapproval, descriptionoftheevent, employeecode, condition, venue, plannedexpenses, actualexpenses, plannednumberP, actualnumberP, customercode, start, end], (error, results) => {
    

    if (error) {
      console.error('Ошибка базы данных:', error); 
      res.send('Ошибка добавления данных в базу данных');
      console.timeEnd('Запрос в базу данных');

    } else {
      
      res.redirect('/events'); 
    }
  });
 }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/eventsCodeForm', (req, res) => {
res.render('eventsCodeForm'); 
});

app.post('/editevents', (req, res) => {
const eventcode = req.body.eventcode;

const query = 'SELECT * FROM events WHERE eventcode = ?';
connection.query(query, [eventcode], (error, results) => {
  if (error) {
    res.send('Ошибка получения данных из базы данных');
  } else {
    if (results.length === 0) {
      
      res.send('Нет записи в базе данных');
    }
    console.log(results[0]);
    res.render('edit_events_form', { employee: results[0] }); 
  }
});
});


app.post('/deleteevents', (req, res) => {
const eventcode = req.body.eventcode;
console.log('eventcode:', eventcode); 

const query = 'DELETE FROM events WHERE eventcode = ?';
connection.query(query, [eventcode], (error, results) => {
  if (error) {
    console.error('Ошибка базы данных:', error); 
    res.send('Ошибка удаления данных из базы данных');
  } else {
    
    res.redirect('/events');
  }
});
});

app.post('/updateevents', (req, res) => {

  const eventcode = req.body.eventcode;
  const eventname = req.body.eventname;
  const eventtypecode = req.body.eventtypecode;
  const dateofapproval = req.body.dateofapproval;
  const descriptionoftheevent = req.body.descriptionoftheevent;
  const employeecode = req.body.employeecode;
  const condition = req.body.condition;
  const venue = req.body.venue;
  const plannedexpenses = req.body.plannedexpenses;
  const actualexpenses = req.body.actualexpenses;
  const plannednumberP = req.body.plannednumberP;
  const actualnumberP = req.body.actualnumberP;
  const customercode = req.body.customercode;
  const start = req.body.start;
  const end = req.body.end;






const updateQuery = 'UPDATE events SET eventname = ?, eventtypecode = ?, dateofapproval = ?, descriptionoftheevent = ?, employeecode = ?, `condition` = ?, venue = ?, plannedexpenses = ?, actualexpenses = ?, plannednumberP = ?, actualnumberP = ?, customercode = ?, start = ?, end = ? WHERE eventcode = ?';

const selectQuery = 'SELECT * FROM events WHERE eventcode = ?';

connection.query(updateQuery, [ eventname, eventtypecode, dateofapproval,  descriptionoftheevent, employeecode, condition,  venue, plannedexpenses, actualexpenses, plannednumberP, actualnumberP, customercode, start, end,  eventcode], (error) => {
if (error) {
  
  
  console.error('Ошибка базы данных:', error); 
  res.send('Ошибка обновления данных в базе данных');

} else {
  
  
  connection.query(selectQuery, [eventcode], (err, updatedResults) => {
    if (err) {
      res.send('Ошибка при попытке получить обновленные данные из базы данных');
    } else {
      
      
      res.render('edit_events_form', { employee: updatedResults[0] });
    }
  });
}
});

});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/formrequesttwo', (req, res) => {
  res.render('formrequesttwo', { data: null }); 
});

app.post('/get_requesttwo_by_request', (req, res) => { 
  const eventcode = req.body.eventcode; 
  const query = 'SELECT performers.eventcode, performers.eventname, performers.employeecode, staff.post, staff.name, staff.lastname, staff.patronymic FROM performers LEFT JOIN staff ON performers.employeecode=staff.employeecode WHERE performers.eventcode = ?';  
  connection.query(query, [eventcode], (error, results) => { 
    if (error) { 
      console.error('Произошла ошибка при получении данных из базы данных:', error);
      res.send('Ошибка получения данных из базы данных' + error); 
    } else { 
      res.render('formrequesttwo', { data: results }); 
    } 
  }); 
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/formrequestthree', (req, res) => {
  res.render('formrequestthree', { data: null }); 
});

app.post('/get_requestthree_by_request', (req, res) => { 
  const eventcode = req.body.eventcode; 
  const query = 'SELECT eventcode, eventname, plannednumberP, actualnumberP FROM events WHERE eventcode = ?';  
  connection.query(query, [eventcode], (error, results) => { 
    if (error) { 
      console.error('Произошла ошибка при получении данных из базы данных:', error);
      res.send('Ошибка получения данных из базы данных' + error); 
    } else { 
      res.render('formrequestthree', { data: results }); 
    } 
  }); 
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/formrequestfour', (req, res) => {
  res.render('formrequestfour', { data: null }); 
});

app.post('/get_requestfour_by_request', (req, res) => { 
  const eventcode = req.body.eventcode; 
  const query = 'SELECT eventcode, eventname, start, end FROM events WHERE eventcode = ?';  
  connection.query(query, [eventcode], (error, results) => { 
    if (error) { 
      console.error('Произошла ошибка при получении данных из базы данных:', error);
      res.send('Ошибка получения данных из базы данных' + error); 
    } else { 
      res.render('formrequestfour', { data: results }); 
    } 
  }); 
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/formrequestone', (req, res) => {
  res.render('formrequestone', { data: null }); 
});

app.post('/get_requestone_by_request', (req, res) => { 
  const month = req.body.month; 
  const query = 'SELECT * FROM events WHERE MONTH(`start`) = ? AND `condition` = "planned"';  
  connection.query(query, [month], (error, results) => { 
    if (error) { 
      console.error('Произошла ошибка при получении данных из базы данных:', error);
      res.send('Ошибка получения данных из базы данных' + error); 
    } else {
      if (results.length === 0) {
        res.render('formrequestone', { warning: 'Запланированных мероприятий на указанный месяц нет'});
      } else { 
      res.render('formrequestone', { data: results }); 
    }
  } 
  }); 
});





















const port = 3000;
app.listen(port, () => {
  console.log('Server running on port ${port}');
});
