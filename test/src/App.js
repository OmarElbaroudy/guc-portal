
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Form from 'react-bootstrap/Form'
import Image from 'react-bootstrap/Image'


function App() {

  return (
<body class="st">
<div class="container">
     <div class="row justify-content-center">
       <div class="col col-xl-7 col-lg-7 col-md-8 col-sm-11 col-md-xs-10 offset-xl-2 offset-lg-1 offset-xs-2">
         <img src="https://www.guc.edu.eg/img/guc_logo_og.png" class="img-circle"/>
       </div>
      <div class="col col-xl-5 col-lg-6 col-md-8 col-sm-12 col-md-xs-12">
        <div class="form-container">
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                enter your @guc mail.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <button type="button" class="btn btn-dark">login</button>
          </Form>
         </div>
        </div>
      </div> 
  </div>
</body>
  

  );
}

export default App;
