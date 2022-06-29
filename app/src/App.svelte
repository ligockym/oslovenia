<script lang="ts">
    import type {NameParserResult} from "./services/NameParser";
    import NameParser from "./services/NameParser";

    const placeholderText =  "<span class='placeholder'>Ing. Janko Hraško, PhD.</span>";

    export let inputContent: string = placeholderText;
    export let parseResult: NameParserResult;
    export let salutation: string | boolean;

    // true only on first load
    let placeholderActive: boolean = true;

    const nameParser = new NameParser();
    $: {
        if (inputContent && !placeholderActive) {
            parseResult = nameParser.parseName(inputContent);
            salutation = nameParser.getSalutation(parseResult);
            // TODO: Tricky because of position of cursor
            // inputContent = nameParser.htmlColorName(inputContent, parseResult);
        }
    }

    function onInputFocus() {
        // clean input on first focus
        if (placeholderActive) {
            placeholderActive = false;
            inputContent = "";
        }
    }

    function onInputBlur() {
        // add placeholder when blur and no content inside
        if (!inputContent) {
            placeholderActive = true;
            inputContent = placeholderText;
        }
    }

</script>

<main>
    <h1>Ako osloviť?</h1>
    <div class="container">
        <div class="input" contenteditable="true" on:focus="{onInputFocus}" on:blur={onInputBlur} bind:innerHTML={inputContent}></div>

        {#if parseResult}
            <div class="salutation">
                <strong><span>{salutation || "bez špeciálneho oslovenia"}</span></strong>
            </div>

            <div class="titles">
                {#each parseResult.titles as title}
                    <article class="title">
                        <header><strong>{title.name}</strong> ({title.correctAbbr})</header>
                        <p>{title.description}</p>
                        <footer>
                            <a target="_blank" href="{title.link}">Viac informácií</a>
                        </footer>
                    </article>
                {/each}
            </div>
        {/if}
    </div>
</main>

<style lang="scss">
  main {
    text-align: center;
    padding: 100px 0;
  }

  .container {
    width: 80%;
    max-width: 500px;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 20px;
  }


  .input {
    border: 1px solid rgba(44, 62, 80,1.0);
    padding: 12px 20px;
    font-size: 30px;

    :global(.placeholder) {
      color: #bdc3c7;
      pointer-events: none;
    }

    @media all and (max-width: 768px) {
      font-size: 18px;
    }
  }

  .salutation {
    background: #ecf0f1;
    margin-top: 20px;
    padding: 20px;
    font-size: 30px;

    @media all and (max-width: 768px) {
      font-size: 18px;
    }
  }

  .title {
    background: #ecf0f1;
    margin-top: 20px;
    text-align: left;

    header {
      border-bottom: 1px solid #bdc3c7;
      padding-top: 10px;
      padding-bottom: 10px;
    }

    footer {
      padding-bottom: 20px;
    }

    header, p, footer {
      padding-left:  15px;
      padding-right:  15px;
    }
  }
</style>