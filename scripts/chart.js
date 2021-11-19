// trend chart
const labels = [
    '11/20',
    '12/20',
    '01/21',
    '02/21',
    '03/21',
    '04/21',
    '05/21',
    '06/21',
    '07/21',
    '08/21',];
  
  const data={
      labels:labels,
      datasets:[{
          label:'Team mood value',
          backgroundColor: 'rgba(255, 0, 0, 1)',
          borderColor: 'rgba(200, 0, 0, 0.8)',
          data:[2,5,0,1,3,4,7,5,6,3],
          fill:false,
          tension:0.5
  
      },
      {label:'Participation',
      backgroundColor: 'rgba(80, 194, 241, 1)',
      borderColor: 'rgba(98, 160, 255, 1)',
          data:[1,0,0.2,1,0.1,1.2,1.7,1.8,2,2.5],
          fill:false,
          tension:0.5
      }]
  };
  
  
  const data2={
      labels:labels,
      datasets:[{
          label:'Team mood value',
          backgroundColor: 'rgba(255, 0, 0, 1)',
          borderColor: 'rgba(200, 0, 0, 0.8)',
          data:[2,2.1,2.3,2.5,1,0.3,0.2,0.3,1,1.5],
          fill:false,
          tension:0.5
  
      },
      {label:'Participation',
      backgroundColor: 'rgba(80, 194, 241, 1)',
      borderColor: 'rgba(98, 160, 255, 1)',
          data:[1,0.8,0.8,0.7,0.4,0.3,0.3,0.2,0.3,0.3],
          fill:false,
          tension:0.5
      }]
  };
  
  
  
  
  const config = {
    type: 'line',
    data: data,
    options: {
  
         responsive: true,
       interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: 'Team mood value & Participation',
          font: {
              family: 'Open Sans',
              size: 16,
              weight: 'bold',
              lineHeight: 0.2,
            },
        },
  
          legend: {
          labels: {
            usePointStyle: true,
          },
        }
      },
       scales: {
        y: {
  
          type: 'linear',
          display: true,
          position: 'left',
          max: 7,
          min: 0,
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
       title: {
            display: true,
            text: 'Team mood value',
            font: {
              family: 'Open Sans',
              size: 12,
              weight: 'bold',
              lineHeight: 0.2,
            },
            padding: {top: 20, left: 0, right: 0, bottom: 0}
          }},
  
  
  
        y2:{
  
          type: 'linear',
          display: true,
          position: 'right',
          min:0,
          max:1,
          title: {
            display: true,
            text: 'Participation',
            font: {
              family: 'Open Sans',
              size: 12,
              weight: 'bold',
              lineHeight: 1,
            },
            padding: {top: 20, left: 0, right: 0, bottom: 0}
          }
  
               }
             }
          }
  };
  
  const config2 = {
    type: 'line',
    data: data2,
    options: {
  
       responsive: true,
       interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: 'Dazzys mood value & Participation',
          font: {
              family: 'Open Sans',
              size: 16,
              weight: 'bold',
              lineHeight: 0.2,
            },
        },
  
        legend: {
          labels: {
            usePointStyle: true,
          },
        }
      },
       scales: {
        y: {
  
          type: 'linear',
          display: true,
          position: 'left',
          max: 7,
          min: 0,
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
       title: {
            display: true,
            text: 'Mood value',
            font: {
              family: 'Open Sans',
              size: 12,
              weight: 'bold',
              lineHeight: 0.2,
            },
            padding: {top: 20, left: 0, right: 0, bottom: 0}
          }},
  
  
  
        y2:{
  
          type: 'linear',
          display: true,
          position: 'right',
          min:0,
          max:1,
          title: {
            display: true,
            text: 'Participation',
            font: {
              family: 'Open Sans',
              size: 12,
              weight: 'bold',
              lineHeight: 1,
            },
            padding: {top: 20, left: 0, right: 0, bottom: 0}
          }
  
             }
             }
          }
  };
  
  
    var UserChart = new Chart(
      document.getElementById('UserChart'),
      config
    );
    // Get the chart that opens the modal
    function myFunction() {
      document.getElementById("UserChart").click();
      var TeamModal = new bootstrap.Modal(document.getElementById('teammodal'), {focus:true});
      console.log(TeamModal);
      TeamModal.show();
      var TeamChart = new Chart(
        document.getElementById('teamChart'),
        config
      );
      
    };
    
