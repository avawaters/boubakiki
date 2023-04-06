// load jsPsych
var jsPsych = initJsPsych({});

// timeline to run experiment
var timeline = [];

// capture info from Prolific
//const sub_id = jsPsych.data.getURLVariable('PROLIFIC_PID');

jsPsych.data.addProperties({
    sub: "test" //DEBUG
});

// stimuli and the features associated to each one
//DEBUG, these are stimuli to test that the experiment works
sounds = ["bouba.wav", "kiki.wav"];
features = [[0, 0, 0], [1, 1, 1]];

// randomly choose what stimulus to give
//n = jsPsych.randomization.sampleWithoutReplacement([0, 1, 2, 3, 4, 5, 6, 7], 1)[0];
n = jsPsych.randomization.sampleWithoutReplacement([0, 1], 1)[0];

sound = sounds[n];
sound_features = features[n];

//DEBUG
console.log(sound);
console.log(sound_features);

var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<p>Welcome!</p><p>In this experiment, you will see two shapes on a screen and hear a nonsensical word repeated 3 times. Please click the shape you think matches the sound.</p>To continue, click the button below.",
    choices: ["Next"]
};

timeline.push(instructions);

var volume_cal = {
    type: jsPsychAudioButtonResponse,
    stimulus: "volume_cal.wav",
    prompt: "<p>As you hear the audio, please adjust your volume to a comfortable level.</p>Click the button to continue.",
    choices: ["Continue"],
}

timeline.push(volume_cal);

// experimental trial
var pre_trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "Great! When you are ready to proceed to the experiment, click the button below:",
    choices: ["Start"]
};

var trial = {
    type: jsPsychAudioButtonResponse,
    stimulus: function () { return sound },
    choices: ["bouba.png", "kiki.png"],
    prompt: "<p>Which shape corresponds to the sound?</p>",
    button_html: "<img src='%choice%' width=500, height=306/>",
    response_allowed_while_playing: false,
    data: {
        sound: function () { return sound },
        // 0 = the feature isn't present, 1 = the feature is present
        voiced: function () { return sound_features[0] },
        round: function () { return sound_features[1] },
        low: function () { return sound_features[2] }
    }
}

timeline.push(pre_trial, trial);

// save data
// var save_server_data = {
//     type: jsPsychCallFunction,
//     func: function () {
//       var data = jsPsych.data.get().json();
//       var xhr = new XMLHttpRequest();
//       xhr.open('POST', 'php/save_json.php');
//       xhr.setRequestHeader('Content-Type', 'application/json');
//       xhr.send(JSON.stringify({ filedata: data }));
//     },
//     post_trial_gap: 1000
// }

// timeline.push(save_server_data);

// debriefs
var debrief = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<p>Thanks for participating in my experiment!</p>If you would like to learn more about it, click the 'Tell Me More!' button.<p>Otherwise, click the 'Back to Prolific' button to complete the study.</p>",
    choices: ["Tell Me More!", "Back to Prolific"],
    // Get button selected
    on_finish: function (data) {
        if (data.response == 1) {
            //DEBUG
            console.log("back to prolific");
            //window.location.href = LINK HERE
        }
    }
};

var full_debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p></p><a href='https://vassar.edu'>CLICK HERE</a> to return to Prolific and complete the study",
    choices: "NO_KEYS"
};

var conditional_full_debrief = {
    timeline: [full_debrief],
    conditional_function: function () {
        return (jsPsych.data.get().last(1).values()[0].response == 0);
    }
}

timeline.push(debrief, conditional_full_debrief);


jsPsych.run(timeline);
