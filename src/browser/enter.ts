// tslint:disable: no-string-literal
import * as $ from "jquery";
(window as any).$ = $;
(window as any).jQuery = $;

import "easy-autocomplete";

$(() => {
    const fields = ["meaning", "context", "type", "example", "visits", "created"];
    armDirty();
    $("#deleteTop").click(deletefn);
    $("#deleteBot").click(deletefn);
    function deletefn(event) {
        const myForm = document.forms["vocab"];
        const data = { word: myForm.word.value };
        if (confirm("For realsies?")) {
            $.ajax(
                "/kill",
                {
                    type: "POST",
                    data,
                    dataType: "json",
                    success: (_) => {
                        stuffContents({}, true, true);
                    },
                    error: (_, error) => {
                        alert("Error " + JSON.stringify(error));
                    },
                });
        }
    }
    $("#bumpTop").click(bumpfn);
    $("#bumpBot").click(bumpfn);
    function bumpfn(event) {

        const myForm = document.forms["vocab"];
        let ctr = myForm.visits.value;
        if (ctr) {
            ctr = parseInt(ctr, 10);
        } else {
            ctr = 0;
        }
        ctr += 1;
        $("#visits").val(ctr);
        $("#visits").css({ background: "pink" });
    }
    $("#saveBot").mouseup(savefn);
    $("#saveTop").mouseup(savefn);
    function savefn(_) {
        const myForm = document.forms["vocab"];
        const data = {
            word: myForm.word.value.trim(),
            meaning: myForm.meaning.value.trim(),
            context: myForm.context.value.trim(),
            type: myForm.type.value.trim(),
            example: myForm.example.value.trim(),
            created: myForm.created.value.trim() || new Date().getTime(),
            visits: myForm.visits.value.trim(),
        };
        const previousContext = myForm.context.value;
        $.ajax(
            "/save",
            {
                type: "POST",
                data,
                dataType: "json",
                success: (data1) => {
                    // alert("Success" + JSON.stringify(data))
                    stuffContents({}, true, true);
                    setTimeout(() => {
                        $("#word").focus();
                        $("#word").select();
                    }, 500);

                },
                error: (request, error) => {
                    alert("Error " + JSON.stringify(error));
                },
            },
        );
    }
    const wordacoptions = {
        url: (_) => {
            return "find";
        },
        getValue: (element) => {
            return element.word;
        },
        ajaxSettings: {
            dataType: "json",
            method: "POST",
            data: {
                dataType: "json",
            },
        },
        list: {
            onChooseEvent: () => {
                // alert("selected " + JSON.stringify($("#word").getSelectedItemData()))
                const itemData = ($("#word") as any).getSelectedItemData();
                stuffContents(itemData);
            },
        },
        preparePostData: (data) => {
            data.fragment = $("#word").val();
            return data;
        },
    };

    ($("#word") as any).easyAutocomplete(wordacoptions);
    $("#word").keypress((event) => {
        const keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode === 13) {
            // see if there is anything in the dictionary already
            const myForm = document.forms["vocab"];
            const data = { word: myForm.word.value };
            $.ajax(
                "/fetch",
                {
                    type: "POST",
                    data,
                    dataType: "json",
                    success: (dataReturned) => {
                        if (dataReturned.length > 0) {
                            stuffContents(data[0], false, true);
                        } else {
                            stuffContents({}, false, true);
                        }

                    },
                    error: (request, error) => {
                        alert("Error " + JSON.stringify(error));
                    },
                });
        }
    });

    const contextacoptions = {
        url: (phrase: any) => {
            return "contexts";
        },
        getValue: (element: any) => {
            return element;
        },
        ajaxSettings: {
            dataType: "json",
            method: "POST",
            data: {
                dataType: "json",
            },
        },
        preparePostData: (data) => {
            data.fragment = $("#context").val();
            return data;
        },
    };
    ($("#context") as any).easyAutocomplete(contextacoptions);

    $("#find").click((event) => {
        const myForm = document.forms["vocab"];
        const data = { fragment: myForm.word.value };
        $.ajax(
            "/find",
            {
                type: "POST",
                data,
                dataType: "json",
                success: (dataReturned) => {
                    alert("Success" + JSON.stringify(dataReturned));
                },
                error: (request, error) => {
                    alert("Error " + JSON.stringify(error));
                },
            });
    });

    function stuffContents(data: any, full = false, context = false) {
        clean();
        for (const field of fields) {
            $("#" + field).val(data[field]);
        }
        if (full) {
            $("#word").val(data.word);
        }
        if (context) {
            fetchLatestContext();
        }
    }
    function armDirty() {
        for (const field of fields) {
            const f = (fld: any) => {
                $(fld).keypress((event) => {
                    $(fld).css({ background: "pink" });
                });
            };
            f("#" + field);
        }
    }
    function clean() {
        for (const field of fields) {
            $("#" + field).css({ background: "white" });
        }
    }
    function fetchLatestContext() {
        $.ajax(
            "/fetchLatest",
            {
                type: "GET",
                dataType: "json",
                success: (data) => {
                    if (data && data.context) {
                        $("#context").val(data.context);
                    }
                },
                error: (request, error) => {
                    alert("Error " + JSON.stringify(error));
                },
            });
    }
});
