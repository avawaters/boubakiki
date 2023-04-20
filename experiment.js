// load jsPsych
var jsPsych = initJsPsych({});

// timeline to run experiment
var timeline = [];

// capture info from Prolific
//const sub_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
const sub_id = "test"; //DEBUG
const fname = `${sub_id}.csv`;

// kiki: audio/feughfeugh.mp3

var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<p>Welcome!</p><p>In this experiment, you will see two shapes on a screen and hear a nonsensical word repeated 3 times. Please click the shape you think matches the sound.</p>To start, click the button below.",
    choices: ["Next"]
};

timeline.push(instructions);

var volume_cal = {
    type: jsPsychAudioButtonResponse,
    stimulus: "audio/audio_check.mp3",
    prompt: "<p>As you hear the audio, please adjust your volume to a comfortable level.</p>When you're ready, click the 'Continue' button.",
    choices: ["Replay", "Continue"],
    response_allowed_while_playing: false
};

var conditional_volume_cal = {
    timeline: [volume_cal],
    loop_function: function (data) {
        if (jsPsych.data.get().last(1).values()[0].response == 0) {
            return true;
        }
        else {
            return false;
        }
    }
}

timeline.push(conditional_volume_cal);

// experimental trial
var pre_trial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "Great! When you are ready to proceed to the experiment, click the button below:",
    choices: ["Start"]
};

var trial = {
    type: jsPsychAudioButtonResponse,
    stimulus: "audio/vaughvaugh.mp3",
    choices: ["figures/bouba.png", "figures/kiki.png"],
    prompt: "<p>Which shape corresponds to the sound?</p>",
    button_html: "<img src='%choice%' width=500, height=306/>",
    response_allowed_while_playing: false,
    data: {
        sound: "vaughvaugh",
        // 0 = the feature isn't present, 1 = the feature is present
        voiced: 1,
        round: 1,
        low: 1
    }
}

// save data
const save_data = {
    type: jsPsychPipe,
    action: "save",
    experiment_id: "UCPvKdFKzciT",
    filename: fname,
    data_string: ()=>jsPsych.data.get().csv()
};

timeline.push(pre_trial, trial, save_data);

// debriefs
var debrief = {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<p>Thanks for your participation!</p>If you would like to learn more about what we're investigating, click the 'Tell Me More!' button.<p>Otherwise, click the 'Back to Prolific' button to complete the study.</p>",
    choices: ["Tell Me More!", "Back to Prolific"],
    // Get button selected
    on_finish: function (data) {
        if (data.response == 1) {
            window.location.href = "https://vassar.edu"
        }
    }
};

var full_debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p style='font-size:28px;'>A robust phenomenon in the field of linguistics is the bouba-kiki effect, where “bouba” is associated with the round shape, and “kiki” is associated with the spiky shape. In this project, we are interested in testing if varying the phonetics of the original “bouba” and “kiki” would still lead to the effect. We are changing the phonetic dimensions of these original stimuli and formed 8 experimental conditions with different combinations of these phonetic features. You received one of these eight conditions, and your response will help us determine what phonetic features are responsible for creating this effect.</p><a href='https://vassar.edu'>CLICK HERE</a> to return to Prolific and complete the study",
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
