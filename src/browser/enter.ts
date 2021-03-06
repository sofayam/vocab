// tslint:disable: no-string-literal
import * as $ from "jquery";
(window as any).$ = $;
(window as any).jQuery = $;

import "easy-autocomplete";
import { fromNow, niceDateString } from "../util/datefn";

$(() => {
    const fields = ["meaning", "type", "example", "_id"];
    armDirty();

    $("#choose").change(function() {
        const choice = $(this).children("option:selected").val();
        const data = { current: choice };
        $.ajax(
            "/setCurrentSource",
            {
                type: "POST",
                data,
                dataType: "json",
                success: (_) => {
                    // alert("yes");
                },
                error: (_, error) => {
                    alert("Error " + JSON.stringify(error));
                },
            });
    });

    $("#deleteTop").click(deletefn);
    $("#deleteBot").click(deletefn);
    function deletefn(event) {
        const myForm = document.forms["vocab"];
        if (myForm._id) {
            const data = { id: myForm._id.value };
            if (confirm("For realsies?")) {
                $.ajax(
                    "/kill",
                    {
                        type: "POST",
                        data,
                        dataType: "json",
                        success: (_) => {
                            stuffContents({}, true);
                        },
                        error: (_, error) => {
                            alert("Error " + JSON.stringify(error));
                        },
                    });
            }
        } else {
            alert("Entry is not in database");
        }
    }

    $("#bumpTop").click(bumpfn);
    $("#bumpBot").click(bumpfn);
    function bumpfn(event) {

        const myForm = document.forms["vocab"];
        const id = myForm._id.value;
        if (id) {
            // get current source
            getCurrentSource().then((source) => {
                const data = {
                    id,
                    context: source.tag,
                };
                $.ajax(
                    "/bump",
                    {
                        type: "POST",
                        data,
                        dataType: "json",
                        success: (_) => {
                            // alert("bumped");
                        },
                        error: (wah, error) => {
                            alert("Whoops " + error + wah);
                        },
                    },
                );
            });
        } else {
            alert("Word is not (yet) in database so cannot be bumped");
        }
    }

    $("#saveBot").mouseup(savefn);
    $("#saveTop").mouseup(savefn);
    function savefn(_) {
        const myForm = document.forms["vocab"];
        const data = {
            _id: myForm._id.value.trim(),
            word: myForm.word.value.trim(),
            meaning: myForm.meaning.value.trim(),
            type: myForm.type.value.trim(),
            example: myForm.example.value.trim(),
        };
        $.ajax(
            "/save",
            {
                type: "POST",
                data,
                dataType: "json",
                success: (data1) => {
                    // alert("Success" + JSON.stringify(data))
                    stuffContents({}, true);
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
                            stuffContents(data[0], false);
                        } else {
                            stuffContents({}, false);
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

    function stuffContents(data: any, full = false) {
        clean();
        for (const field of fields) {
            $("#" + field).val(data[field]);
        }
        if (full) {
            $("#word").val(data.word);
        }
        if (data.sightings) {
            const numSightings = String(data.sightings.length);
            // TODO: popup here
            // const fnow = fromNow(data.sightings[0].time);
            $("#visits").text(numSightings);
        } else {
            $("#visits").text("");
        }
        if (data.created) {
            const fnow = fromNow(data.created);
            const nds = niceDateString(data.created);
            const fulldate = fnow + " (" + nds + ")";
            // TODO: Humanised string n <largest unit>s ago
            $("#created").text(fulldate);
        } else {
            $("#created").text("");
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
    /*
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
    */
    function getCurrentSource() {
        return new Promise<any>((resolve, reject) => {
            $.ajax(
                "/getCurrentSource",
                {
                    type: "GET",
                    dataType: "json",
                    success: (data) => {
                        resolve(data);
                    },
                    error: (_, error) => {
                        reject();
                    },
                },
            );
        });
    }

    $("#deets").mouseup(deetsfn);

    function deetsfnOld() {
        const myForm = document.forms["vocab"];
        const formId = myForm._id.value;
        if (formId) {
            const deetsURL = `/sightings?id=${formId}`;
            window.location.href = deetsURL;
        }
    }

    function deetsfn() {

        const myForm = document.forms["vocab"];
        const word = myForm.word.value.trim();
        const id = myForm._id.value;

        if (id) {

            const modal = document.getElementById("myModal");

            const closer = document.getElementsByClassName("close")[0];

            $("#modalheader").text(`Sightings of "${word}" so far:`);

            $.ajax(
                "/sightings?id=" + id,
                {
                    type: "GET",
                    dataType: "json",
                    success: (data) => {
                        $("#modalbody ul").text("");
                        for (const item of data.results) {
                            $("#modalbody ul").append(`<li>${item}</li>`);
                        }

                        if (modal) {
                            modal.style.display = "block";

                            // When the user clicks on <span> (x), close the modal
                            (closer as any).onclick = () => {
                                modal.style.display = "none";
                            };
                        }

                    },
                },

            );

            // When the user clicks anywhere outside of the modal, close it
            /*
            window.onclick = (event) => {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            };
            */
        }
    }
});
