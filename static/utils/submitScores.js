
export default function sendScoreToServer(score) {
    fetch('/submit_score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score: score }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Score submitted successfully:', data.message);
      // Optionally, you can handle the response from the server here
    })
    .catch(error => {
      console.error('Error submitting score:', error);
      // Optionally, you can handle errors here
    });
  }