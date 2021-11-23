// Team chart
var jsonFile = $.ajax({
                        url: '/jsonFile/teamChart.json',
                        dataType: 'json'
                      })
                .then(
                      function(results) {
                          //get label
                          var labels = results.map(function(e) {
                            date = e.date.split("T")[0];
                            // console.log(date)
                            return date;
                          });
                          
                          //get mood
                          var mood = results.map(function(e) {
                            return e.mood;
                          });
                          
                          //get participation
                          var participation = results.map(function(e) {
                            return e.daily_action;
                          });
                          
                          const data=
                                    {
                                      labels:labels,
                                      datasets:[
                                                  {
                                                    label:'Team mood value',
                                                    backgroundColor: 'rgba(255, 0, 0, 1)',
                                                    borderColor: 'rgba(200, 0, 0, 0.8)',
                                                    data:mood,
                                                    fill:false,
                                                    tension:0.5
                                                  },
                                                  {
                                                    label:'Participation',
                                                    backgroundColor: 'rgba(80, 194, 241, 1)',
                                                    borderColor: 'rgba(98, 160, 255, 1)',
                                                    data:participation,
                                                    fill:false,
                                                    tension:0.5
                                                  }
                                                ]
                                    };
                                    
                          const config = {
                                          type: 'line',
                                          data: data,
                                          options: 
                                                  {
                                                    responsive: true,
                                                    interaction: {
                                                                    mode: 'index',
                                                                    intersect: false,
                                                                  },
                                                    stacked: false,
                                                    plugins: 
                                                            {
                                                              title: 
                                                                    {
                                                                      display: true,
                                                                      text: 'Team mood value & Participation',
                                                                      font: 
                                                                            {
                                                                              family: 'Open Sans',
                                                                              size: 16,
                                                                              weight: 'bold',
                                                                              lineHeight: 0.2,
                                                                            },
                                                                    },

                                                                  legend: 
                                                                          {
                                                                            labels: 
                                                                                    {
                                                                                      usePointStyle: true,
                                                                                    },
                                                                          }
                                                            },
                                                    scales: 
                                                            {
                                                              y: 
                                                                {
                                                                  type: 'linear',
                                                                  display: true,
                                                                  position: 'left',
                                                                  max: 7,
                                                                  min: 0,
                                                                  grid: 
                                                                        {
                                                                          drawOnChartArea: false, // only want the grid lines for one axis to show up
                                                                        },
                                                                  title: 
                                                                        {
                                                                          display: true,
                                                                          text: 'Team mood value',
                                                                          font: 
                                                                                {
                                                                                  family: 'Open Sans',
                                                                                  size: 12,
                                                                                  weight: 'bold',
                                                                                  lineHeight: 0.2,
                                                                                },
                                                                          padding: {top: 20, left: 0, right: 0, bottom: 0}
                                                                        }
                                                                  },
                                                              y2:{
                                                                    type: 'linear',
                                                                    display: true,
                                                                    position: 'right',
                                                                    min:0,
                                                                    max:1,
                                                                    title: 
                                                                          {
                                                                            display: true,
                                                                            text: 'Participation',
                                                                            font: 
                                                                                  {
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
                          var userChart = new Chart(
                            document.getElementById('userChart'),
                            config
                          );
                          var teamChart = new Chart(
                            document.getElementById('teamChart'),
                            config
                          );
                      }
                    );
   
  


// Get the chart that opens the modal
function myFunction() {
  document.getElementById("userChart").click();
  var teamModal = new bootstrap.Modal(document.getElementById('teammodal'), {focus:true});
  teamModal.show();
};


// Each user's chart
var jsonFile = $.ajax({
  url: '/jsonFile/userChart.json',
  dataType: 'json'
})
.then(
function(results) {
    //get label
    var userlabels = results.map(function(e) {
      date = e.date.split("T")[0];
      // console.log(date)
      return date;
    });
    //get name
    console.log(results);
     
    //get mood
    var userMood = results.map(function(e) {
      return e.mood;
    });
    
    //get participation
    var userParticipation = results.map(function(e) {
      return e.participation;
    });
    
    const userData=
              {
                labels:userlabels,
                datasets:[
                            {
                              label:'User mood value',
                              backgroundColor: 'rgba(255, 0, 0, 1)',
                              borderColor: 'rgba(200, 0, 0, 0.8)',
                              data:userMood,
                              fill:false,
                              tension:0.5
                            },
                            {
                              label:'Participation',
                              backgroundColor: 'rgba(80, 194, 241, 1)',
                              borderColor: 'rgba(98, 160, 255, 1)',
                              data:userParticipation,
                              fill:false,
                              tension:0.5
                            }
                          ]
              };
              
    const userConfig = {
                    type: 'line',
                    data: userData,
                    options: 
                            {
                              responsive: true,
                              interaction: {
                                              mode: 'index',
                                              intersect: false,
                                            },
                              stacked: false,
                              plugins: 
                                      {
                                        title: 
                                              {
                                                display: true,
                                                text: 'User mood value & Participation',
                                                font: 
                                                      {
                                                        family: 'Open Sans',
                                                        size: 16,
                                                        weight: 'bold',
                                                        lineHeight: 0.2,
                                                      },
                                              },

                                            legend: 
                                                    {
                                                      labels: 
                                                              {
                                                                usePointStyle: true,
                                                              },
                                                    }
                                      },
                              scales: 
                                      {
                                        y: 
                                          {
                                            type: 'linear',
                                            display: true,
                                            position: 'left',
                                            max: 7,
                                            min: 0,
                                            grid: 
                                                  {
                                                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                                                  },
                                            title: 
                                                  {
                                                    display: true,
                                                    text: 'Team mood value',
                                                    font: 
                                                          {
                                                            family: 'Open Sans',
                                                            size: 12,
                                                            weight: 'bold',
                                                            lineHeight: 0.2,
                                                          },
                                                    padding: {top: 20, left: 0, right: 0, bottom: 0}
                                                  }
                                            },
                                        y2:{
                                              type: 'linear',
                                              display: true,
                                              position: 'right',
                                              min:0,
                                              max:1,
                                              title: 
                                                    {
                                                      display: true,
                                                      text: 'Participation',
                                                      font: 
                                                            {
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
    var personChart = new Chart(
      document.getElementById('personChart'),
      userConfig
    );
}
);
