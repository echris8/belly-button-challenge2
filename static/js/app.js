// Place url in a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use d3.json() to fetch the data
d3.json(url).then(function(data) {
    console.log(data);
}); 


// Create init function 
function init() {
    // Create the dropdown list variable for all sample id's and start d3
    let dropdown = d3.select("#selDataset");
    
    d3.json(url).then((data) => {
        let sampleIds = data.names;

        console.log(sampleIds);
        for (let id of sampleIds) {
            dropdown.append("option").attr("value", id).text(id);
        }
        // Store the first sample as the initial one
        let firstEntry = sampleIds[0];
        console.log(firstEntry);
        
        // Have the init() function call the graph generating functions with the first entry (id 940)
        makeBar(firstEntry);
        makeBubble(firstEntry);
        makeDemographics(firstEntry);
    }); // End of d3 
}

// Function that builds the bar chart
function makeBar(sample) {     
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        let results = sampleInfo.filter(entry => entry.id == sample);
        let firstData = results[0];
        let sortedIndices = firstData.sample_values.map((_, i) => i).sort((a, b) => firstData.sample_values[b] - firstData.sample_values[a]);
        let otuIds = sortedIndices.slice(0, 10).map(index => firstData.otu_ids[index]);
        let otuLabels = sortedIndices.slice(0, 10).map(index => firstData.otu_labels[index]);
        let sampleValues = sortedIndices.slice(0, 10).map(index => firstData.sample_values[index]);

        // Set up the bar chart
        let trace = {
            x: sampleValues,
            y: otuIds.map(id => "OTU " + id), 
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout); 
    });
}

function makeBubble(sample) {
    // Access the sample data for the bubble chart
    d3.json(url).then((data) => {
        let sampleData = data.samples;
        // Filter data based on sample id
        let results = sampleData.filter(entry => entry.id == sample);
        let firstResult = results[0];
        console.log(firstResult);

        // Store the results 
        let sampleValues = firstResult.sample_values;
        let otuIds = firstResult.otu_ids;
        let otuLabels = firstResult.otu_labels;
        console.log(sampleValues);
        console.log(otuIds);
        console.log(otuLabels);

        // Create bubble chart
        let bubbleTrace = {
            x: otuIds.reverse(),
            y: sampleValues.reverse(),
            text: otuLabels.reverse(),
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
            }
        };

        // Bubble chart layout
        let layout = {
            title: "Bacteria Count for each Sample ID",
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Number of Bacteria' }
        };
        Plotly.newPlot("bubble", [bubbleTrace], layout); 
    });
}

//Make demographic data section
function makeDemographics(sample) {
    // Access the sample data 
    d3.json(url).then((data) => {
        // Access the demographic info 
        let demographicInfo = data.metadata;
        // Filter data based on sample id
        let results = demographicInfo.filter(entry => entry.id == sample);
        let firstResult = results[0];
        console.log(firstResult);
        // Clear out previous data info section by setting the text to a blank string
        d3.select('#sample-metadata').text('');

        //Formatting of demographic section 
        Object.entries(firstResult).forEach(([key, value]) => {
            console.log(key, value);
            let formattedKey = key
            .split('_')  
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            let element = 'p'; 
            d3.select('#sample-metadata').append(element).text(`${formattedKey}: ${value}`);
        });
    });
}

// Define the function when the dropdown detects a change (function name as defined in index.html)
function optionChanged(value) {
    // Log the value for debug
    console.log(value);
    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
}

init();