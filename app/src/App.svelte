<script lang="ts">
    import type {NameParserResult} from "./services/NameParser";
    import NameParser from "./services/NameParser";
    import {t, locale, locales} from "./i18n";
    import debounce from 'lodash/debounce';

    import {init, track, parameters, trackPages} from "insights-js"

    export let inputContent: string = '';
    export let parseResult: NameParserResult;
    export let salutation: string | boolean;
    export let gender: Gender = 'man';

    const nameParser = new NameParser();

    if (window.location.hostname !== 'location') {
        // Analytics
        init("Eytdh1SGTNZqPPAJ");
        trackPages();
    }

    const sendEventForWritingName = (inputContent: string) => {
        track({
            id: "input",
            parameters: {
                locale: parameters.locale(),
                pageLocale: $locale,
                text: inputContent
            }
        })
    }

    // send event to analytics after 2seconds of not writing
    const debouncedEvent = debounce(sendEventForWritingName, 2000);

    $: {
        if (inputContent) {
            parseResult = nameParser.parseName(inputContent, $locale);
            salutation = nameParser.getWholeSalutation(parseResult, gender, $locale);

            // TODO: Tricky because of position of cursor
            // inputContent = nameParser.htmlColorName(inputContent, parseResult);

            debouncedEvent(inputContent);
        }
    }

</script>

<div class="page">
    <div class="languages">
        <img src="img/slovakia.png" height="30" alt="Slovenský jazyk" class:active={$locale === 'sk'} on:click="{() => $locale = 'sk'}">
        <img src="img/czechia.png" height="30" alt="Český jazyk" class:active={$locale === 'cz'} on:click={() => $locale = 'cz'}>
    </div>
    <main>
        <div class="container">
            <h1>{$t("homepage.title")}</h1>
            <p>{$t("homepage.welcome")}</p>
            <input class="input" bind:value={inputContent} placeholder="{$t('homepage.placeholder')}">

            <div class="gender">
                <label>
                    <input type="radio" name="gender" value="man" bind:group={gender}>{$t("man")}
                </label>
                <label>
                    <input type="radio" name="gender" value="woman" bind:group={gender}>{$t("woman")}
                </label>
            </div>

            {#if parseResult}
                <div class="salutation">
                    {$t("salutation")}: <strong><span>{salutation}</span></strong>
                </div>
            {/if}

        </div>
        <div class="container">
            {#if parseResult}
                <div class="titles">
                    {#each parseResult.titles as title}
                        <article class="title">
                            <header>
                                <span><strong>{title.name}</strong> ({title.correctAbbr})</span>
                                <span>{nameParser.getTitleSalutation(title, gender) || $t("no-salutation")}</span>
                            </header>
                            <p>{title.description}</p>
                            <footer>
                                <a target="_blank" href="{title.link}">{$t("more-info")}</a>
                            </footer>
                        </article>
                    {/each}
                </div>
            {/if}
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>{$t("footer.students")} ❤</p>
            <p>{$t("footer.copyright")}
                <a href="mailto:marian@marianligocky.sk">{$t("footer.writeus")}</a></p>
        </div>
    </footer>

</div>

<style lang="scss">
  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .languages {
    display: flex;
    justify-content: flex-end;
    padding: 15px;
    top: 0;
    right: 0;

    img {
      margin-left: 5px;
      height: 30px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      opacity: 0.6;
      transition: .2s opacity;
      cursor: pointer;
    }

    img.active, img:hover {
      opacity: 1;
    }
  }

  main {
    text-align: center;
    padding: 10px 0 50px;
    flex: 1 0 auto;
  }

  .footer {
    padding: 15px;
    font-size: 14px;
    text-align: center;

    p {
      margin-top: 0;
      margin-bottom: 0;
      line-height: 1.6;
    }
  }

  .container {
    width: 90%;
    max-width: 670px;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 20px;
  }


  .input {
    border: 1px solid rgba(44, 62, 80, 1.0);
    padding: 12px 20px;
    font-size: 30px;
    width: 100%;
    text-align: center;

    :global(.placeholder) {
      color: #bdc3c7;
      pointer-events: none;
    }

    @media all and (max-width: 768px) {
      font-size: 18px;
    }
  }

  .gender {
    display: flex;
    justify-content: space-around;
    font-size: 25px;
    text-transform: capitalize;

    @media all and (max-width: 768px) {
      font-size: 18px;
    }

    input {
      margin-right: 15px;
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

    &:not(:first-of-type) {
      opacity: 0.8;
    }

    header {
      border-bottom: 1px solid #bdc3c7;
      padding-top: 10px;
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }

    footer {
      padding-bottom: 20px;
    }

    header, p, footer {
      padding-left: 15px;
      padding-right: 15px;
    }
  }
</style>