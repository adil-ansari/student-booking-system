import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from './AuthContext';
import './SlotBookingForm.css';


const SlotForm = () => {
  const { user } = useAuth(); // Destructure to get the user object

  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    sessionType: "Appointment",
    studentName: user.name,
    studentEmail: user.email,
    studentMajor: '',
    courseNumber: [],
    // startingTime: ''
  });
  const [formStatus, setFormStatus] = useState(''); // 'success', 'slotFilled', 'error'
  const [errorMessage, setErrorMessage] = useState('');



  const resetForm = () => {
    setStep(1);
    setSelectedDay('');
    setSelectedSlot(null);
    setSlots([]);
    setFormData({
      sessionType: "Appointment",
      studentName: user.name,
      studentEmail: user.email,
      studentMajor: '',
      courseNumber: [],
      // startingTime: ''
    });
    setIsOtherCourseChecked(false);
    setFormStatus('');
    setErrorMessage('');
  };

  const [isOtherCourseChecked, setIsOtherCourseChecked] = useState(false);

  useEffect(() => {
    if (selectedDay) {
      fetchSlots(selectedDay);
    }
  }, [selectedDay]);

  const handleDayChange = (day) => {
    setSelectedDay(day);
    setSelectedSlot(null); // Reset the slot selection when day changes
  };

  const handleSlotChange = (slotId) => {
    setSelectedSlot(slotId);
  };

  const handleOtherCourseChange = (e) => {
    setIsOtherCourseChecked(e.target.checked);
  };

  const fetchSlots = async (day) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/slots?day=${day}`);
      console.log("slots data", response.data)
      setSlots(response.data || []);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleNext = () => {
    if (selectedSlot) {
      setStep(step + 1);
    } else {
      alert('Please select a slot before proceeding.');
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "courseNumber") {
      if (checked) {
        setFormData(prevFormData => ({
          ...prevFormData,
          courseNumber: [...prevFormData.courseNumber, value]
        }));
      } else {
        setFormData(prevFormData => ({
          ...prevFormData,
          courseNumber: prevFormData.courseNumber.filter(cn => cn !== value)
        }));
      }
    } else if (type === "radio" || type === "text" || type === "email" || type === "time") {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      selectedDay,
      selectedSlot
    };
    try {
      console.log(dataToSubmit)
      const response = await axios.post(`${process.env.REACT_APP_API_HOST}/api/book`, dataToSubmit);
      console.log(response.data);

      if (response.data && response.data.error === 50001) {
        setFormStatus('slotFilled');
        setErrorMessage(response.data?.message)
      } else {
        setFormStatus('success');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Oops! There is an error.');
      setFormStatus('error');
    }
  };

    // Function to render the status message and button to reset the form
  const renderFormStatus = () => {
    let message = '';
    switch(formStatus) {
      case 'success':
        message = 'You will receive an email confirmation';
        break;
      case 'slotFilled':
        message = errorMessage;
        break;
      case 'error':
        message = errorMessage;
        break;
      default:
        message = '';
    }

    return (
      <div className="container mt-3">
        <div class="form-group">
          <div className="alert alert-info">{message}</div>
          <button className="btn btn-primary form-button" onClick={resetForm}>Start Over</button>
        </div>
      </div>
    );
  };

  // Render logic based on the form status
  if (formStatus) {
    return renderFormStatus();
  }

  return (
    <div className="container mt-3">
      <div className="form-container">
      <h2 className="form-heading">CSSL Tutor - Slot Booking</h2>
        {step === 1 && (
          <>
            <div className="btn-group" role="group" aria-label="Basic example">
              {['M', 'T', 'Th'].map(day => (
                <button
                  key={day}
                  type="button"
                  className={`btn ${selectedDay === day ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleDayChange(day)}>
                  {day}
                </button>
              ))}
            </div>
            <form className="mt-3">
              {slots.map(slot => (
                <div className="form-check" key={slot.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="slot"
                    id={`slot${slot.id}`}
                    value={slot.id}
                    checked={selectedSlot === slot.id}
                    onChange={() => handleSlotChange(slot.id)}
                  />
                  <label className="form-check-label" htmlFor={`slot${slot.id}`}>
                    {moment(slot.start_time, 'HH:mm:ss').format('hh:mm A')} - {moment(slot.end_time, 'HH:mm:ss').format('hh:mm A')}
                  </label>
                </div>
              ))}
              <button type="button" className="btn btn-secondary next-button" onClick={handleNext}>Next</button>
            </form>
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit}>

              <div class="form-group">
                  <label for="studentName">Student Name *</label>
                  <input type="text" class="form-control" id="studentName" name="studentName" required value = {user.name} disabled = {true}/>
              </div>

              <div class="form-group">
                  <label for="studentEmail">Student Email *</label>
                  <input type="email" class="form-control" id="studentEmail" name="studentEmail" required value = {user.email} disabled = {true}/>
              </div>

              <div class="form-group">
                  <label>Student Major *</label>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="studentMajor" id="cs" value="CS" onChange={handleChange}/>
                      <label class="form-check-label" for="cs">CS</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="studentMajor" id="se" value="SE" onChange={handleChange}/>
                      <label class="form-check-label" for="se">SE</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="studentMajor" id="ds" value="DS" onChange={handleChange}/>
                      <label class="form-check-label" for="ds">DS</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="studentMajor" id="undeclared" value="Undeclared" onChange={handleChange}/>
                      <label class="form-check-label" for="undeclared">Undeclared</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="radio" name="studentMajor" id="otherMajor" value="Other" onChange={handleChange}/>
                      <label class="form-check-label" for="otherMajor">Other</label>
                      <input type="text" class="form-control" id="otherMajorText" name="studentMajorOther" onChange={handleChange}/>
                  </div>
              </div>


              <div class="form-group">
                  <label>Course Number *</label>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="courseNumber" id="cs46a" value="CS46A" onChange={handleChange}/>
                      <label class="form-check-label" for="cs46a">CS46A</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="courseNumber" id="cs46b" value="CS46B" onChange={handleChange}/>
                      <label class="form-check-label" for="cs46b">CS46B</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="courseNumber" id="cs131" value="CS131" onChange={handleChange}/>
                      <label class="form-check-label" for="cs131">CS131</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="courseNumber" id="cs146" value="CS146" onChange={handleChange}/>
                      <label class="form-check-label" for="cs146">CS146</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="courseNumber" id="cs151" value="CS151" onChange={handleChange} />
                      <label class="form-check-label" for="cs151">CS151</label>
                  </div>
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" name="courseNumber" id="otherCourse" value="Other" onChange={handleOtherCourseChange}/>
                      <label class="form-check-label" for="other">Other</label>
                  </div>
                  <input type="text" class="form-control mt-2" id="otherCourseDetails" name="otherCourseDetails" placeholder="Enter additional details" disabled={!isOtherCourseChecked}  onChange={handleChange}/>
              </div>


              {/* <div class="form-group">
                  <label for="startingTime">Starting Time *</label>
                  <input type="time" class="form-control" id="startingTime" name="startingTime" required/>
              </div> */}
              
              <button type="button" className="btn btn-secondary next-button" onClick={handlePrevious}>Previous</button>
              <input type="submit" value="Submit" className="btn btn-primary form-button" />
          </form>
        )}
      </div>
    </div>
  );
};

export default SlotForm;
