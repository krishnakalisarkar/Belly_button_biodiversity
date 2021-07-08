function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
//------------------------------------------------------------------------------------
// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample); 
}
//---------------------------------------------------------------------------------------
// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
//------------------------------------------------------------------------------------
//**********************************************************************************
// Deliverable 1: horizontal Bar Chart.
//**********************************************************************************
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);
    // 3. Create a variable that holds the samples array.
    var samples =  data.samples; 

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = resultArray[0];
    console.log(firstSample);
 
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleOtuId = firstSample.otu_ids.map(id => id);
    console.log(sampleOtuId);
    var sampleLabel = firstSample.otu_labels.map(labels => labels);
    console.log(sampleLabel);
    var sampleValue = firstSample.sample_values.map(values => values);
    console.log(sampleValue);

    // Create a variable that holds the 

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    var ids =  sampleOtuId.slice(0,10);
    console.log(ids);
    var topTen = sampleValue.slice(0,10);
    console.log(topTen);
    var topTenLabels = sampleLabel.slice(0,10);
    console.log(topTenLabels);
    
    var yticks = sampleOtuId.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: sampleValue.slice(0,10).reverse(),
      text: sampleLabel.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {color: "rgb(142,124,195)"}
      }];
    // 9. Create the layout for the bar chart. 
    
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  

  
//------------------------------------------------------------------------------------
//*************************************************************************************/
// Deliverable 2: Bubble Chart.
//*************************************************************************************/ 

    // 1. Create the trace for the bubble chart.
    var bubbleData = [ {
      x: sampleOtuId,
      y: sampleValue,
      mode: "markers",
      text: sampleLabel,
      marker: {
        size: sampleValue,
        sizemode: "diameter",
        color: sampleOtuId,
        colorscale: "Earth"
      }
    }
   ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Count"},
      hovermode: "closest",
      autosize: "true",
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      },
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData,bubbleLayout);

  });
}
