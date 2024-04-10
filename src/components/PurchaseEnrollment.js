import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import './PurchaseEnrollment.css';

const stripePromise = loadStripe('pk_test_51NcTgHGTSz0AdlYqo6srEbeoKWlF008DEjjD1rHPK8BE4mMBgPdfucABISvbfOMypelhjtn3924DqQkxsaiWiXUn00wpAhlwOO');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  // State for the additional input fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [purchaseOption, setPurchaseOption] = useState('diagnostic');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe.js hasn't loaded yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (purchaseOption === 'diagnostic') {
      // Implement logic to handle diagnostic purchase
      console.log('Processing SGD 50 payment for additional diagnostic');
    } else if (purchaseOption === 'subscription') {
      // Implement logic to handle subscription purchase
      console.log('Processing SGD 600/yr payment for annual subscription');
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error('[error]', error);
    } else {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;

      fetch(`${backendUrl}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dateOfBirth,
          // Include any other necessary data here
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          navigate('/thank-you'); // Navigate to the Thank You page on success
        } else {
          throw new Error('Subscription failed');
        }
      })
      .catch(error => {
        console.error('There was an issue with your subscription:', error);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="purchase-form">
      <label>
        First Name:
        <input type="text" value={firstName} className="input-field" onChange={(e) => setFirstName(e.target.value)} />
      </label>
      <label>
        Last Name:
        <input type="text" value={lastName} className="input-field" onChange={(e) => setLastName(e.target.value)} />
      </label>
      <label>
        Date of Birth:
        <input type="date" value={dateOfBirth} className="input-field" onChange={(e) => setDateOfBirth(e.target.value)} />
      </label>
            {/* Purchase option radio buttons */}
      <div>
        <label className="radio-option">
          <input
            type="radio"
            name="purchaseOption"
            value="diagnostic"
            checked={purchaseOption === 'diagnostic'}
            onChange={() => setPurchaseOption('diagnostic')}
          />
          Purchase Additional Diagnostic (SGD 50)
        </label>
        <label className="radio-option">
          <input
            type="radio"
            name="purchaseOption"
            value="subscription"
            checked={purchaseOption === 'subscription'}
            onChange={() => setPurchaseOption('subscription')}
          />
          Annual Subscription - Unlimited Diagnostics + Adaptive Learning App (SGD 600/year)
        </label>
      </div>
      <CardElement />
       <button type="submit" disabled={!stripe} className="submit-button">
        {purchaseOption === 'diagnostic' ? 'Purchase Diagnostic' : 'Subscribe for SGD 600/yr'}
      </button>
    </form>
  );
};

const PurchaseEnrollment = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="purchase-container">
        <h2>Enrollment Options</h2>
        <p>Welcome to All Gifted! Choose from the options below to continue your learning journey.</p>
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default PurchaseEnrollment;
