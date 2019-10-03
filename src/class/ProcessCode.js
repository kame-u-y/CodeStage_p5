/* 
stageParams = {
    top: [{ length, sentence, hljsKeywords }], 
    bottom: [{ length, sentence, hljsKeywords }]
}

enemyParams = {
    top: [{ index, type, pos: {x, y} }], 
    bottom: [{ index, type, pos: {x, y} }]
}
*/

const HLJS_KEYWORDS = [
    "hljs-keyword",
    "hljs-string",
    "hljs-class",
    "hljs-attr",
    "hljs-literal",
    "hljs-built_in",
    "hljs-meta",
    "hljs-number",
    "hljs-function",
    "hljs-comment",
    "hljs-symbol",
    "hljs-title",
]

export class ProcessCode {
    constructor() {
        this.stageParams = {
            top: [],
            bottom: [],
        };
        this.enemyParams = {
            top: [],
            bottom: [],
        };
    }

    _addStageParams(file, isTop) {
        if (file===null) return;
        const containerId = isTop ? "top-container" : "bottom-container";
        const codeContainer = document.getElementById(containerId);
        let fileReader = new FileReader();
        
        fileReader.onload = () => {
            codeContainer.innerHTML = hljs.highlightAuto(fileReader.result).value;

            // ハイライトのキーワードリストを作成
            const keywordArray = codeContainer.innerHTML.split(/\r\n|\r|\n/).map((row) => {
                const resArray = [];
                HLJS_KEYWORDS.forEach((key) => {
                    if (row.match(key)) {
                        resArray.push(key);
                    }
                });
                return resArray;
            });

            // sentenceParamsに文字長、キーワードリストを登録
            let spArr = [], epArr = [];
            const sentenceArray = codeContainer.innerText.split(/\r\n|\r|\n/);
            sentenceArray.forEach((senVal, senId) => {
                spArr.push({
                    length: senVal.length,
                    sentence: senVal,
                    hljsKeywords: keywordArray[senId],
                });
   
                keywordArray[senId].forEach((keyVal) => {
                    epArr.push({
                        index: senId,
                        type: keyVal,
                        pos: {
                            x: 0,
                            y: 0,
                        }
                    });
                });
            });

            if (isTop) {
                this.stageParams.top = this.stageParams.top.concat(spArr);
                this.enemyParams.top = this.enemyParams.top.concat(epArr);
            } else {
                this.stageParams.bottom = this.stageParams.bottom.concat(spArr);
                this.enemyParams.bottom = this.enemyParams.bottom.concat(epArr);
            }
        }
        fileReader.readAsText(file);
    }

    _setupFileListener() {
        // document.getElementById("top-stage").style.zIndex = -1000;
        let topFiles = [];
        $("#top-file-selector").change((ev) => topFiles = ev.currentTarget.files);
        $("#add-top").click(() => {
            this._addStageParams(topFiles[0], true);
            // document.getElementById("top-stage").style.zIndex = 0;
        });

        // document.getElementById("bottom-stage").style.zIndex = -1000;
        let bottomFiles = [];
        $("#bottom-file-selector").change((ev) => bottomFiles = ev.currentTarget.files);
        $("#add-bottom").click(() => {
            this._addStageParams(bottomFiles[0], false);
            // document.getElementById("bottom-stage").style.zIndex = 0;
        });
    }

    init() {
        this._setupFileListener();
    }
}