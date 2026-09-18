export default {
  route: {
    dashboard: 'Instrumentpanel',
    documentation: 'Dokumentation',
    guide: 'Guide',
    permission: 'Behörighet',
    pagePermission: 'Sidbehörighet',
    rolePermission: 'Rollbehörighet',
    directivePermission: 'Direktivbehörighet',
    icons: 'Ikoner',
    components: 'Komponenter',
    tinymce: 'Tinymce',
    markdown: 'Markdown',
    jsonEditor: 'JSON-redigerare',
    dndList: 'Dra-och-släpp-lista',
    splitPane: 'Delad panel',
    avatarUpload: 'Avataruppladding',
    dropzone: 'Släppzon',
    sticky: 'Klibbig',
    countTo: 'Räkna till',
    componentMixin: 'Mixin',
    backToTop: 'Tillbaka till toppen',
    dragDialog: 'Dra dialog',
    dragSelect: 'Dra urval',
    dragKanban: 'Dra Kanban',
    charts: 'Diagram',
    keyboardChart: 'Tangentbordsdiagram',
    lineChart: 'Linjediagram',
    mixChart: 'Blandat diagram',
    example: 'Exempel',
    nested: 'Nästlade rutter',
    menu1: 'Meny 1',
    'menu1-1': 'Meny 1-1',
    'menu1-2': 'Meny 1-2',
    'menu1-2-1': 'Meny 1-2-1',
    'menu1-2-2': 'Meny 1-2-2',
    'menu1-3': 'Meny 1-3',
    menu2: 'Meny 2',
    Table: 'Tabell',
    dynamicTable: 'Dynamisk tabell',
    dragTable: 'Dra tabell',
    inlineEditTable: 'Inbäddad redigering',
    complexTable: 'Komplex tabell',
    tab: 'Flik',
    form: 'Formulär',
    createArticle: 'Skapa artikel',
    editArticle: 'Redigera artikel',
    articleList: 'Artikellista',
    errorPages: 'Felsidor',
    page401: '401',
    page404: '404',
    errorLog: 'Fellogg',
    excel: 'Excel',
    exportExcel: 'Exportera Excel',
    selectExcel: 'Exportera markerade',
    mergeHeader: 'Sammanfoga rubrik',
    uploadExcel: 'Ladda upp Excel',
    zip: 'Zip',
    pdf: 'PDF',
    exportZip: 'Exportera Zip',
    theme: 'Tema',
    clipboardDemo: 'Urklipp',
    i18n: 'Internationalisering',
    externalLink: 'Extern länk',
    profile: 'Profil'
  },
  navbar: {
    dashboard: 'Instrumentpanel',
    github: 'Github',
    logOut: 'Logga ut',
    profile: 'Profil',
    theme: 'Tema',
    size: 'Global storlek'
  },
  login: {
    title: 'Inloggningsformulär',
    logIn: 'Logga in',
    username: 'Användarnamn',
    password: 'Lösenord',
    any: 'valfri',
    thirdparty: 'Eller anslut med',
    thirdpartyTips: 'Kan inte simuleras lokalt, så kombinera din egen företagssimulering!'
  },
  documentation: {
    documentation: 'Dokumentation',
    github: 'Github-arkiv'
  },
  permission: {
    addRole: 'Ny roll',
    editPermission: 'Redigera',
    roles: 'Dina roller',
    switchRoles: 'Byt roller',
    tips: 'I vissa fall kommer v-permission inte att fungera. Till exempel: Element-UI el-tab eller el-table-column och andra scenarier som dynamiskt renderar DOM. Du kan bara göra detta med v-if.',
    delete: 'Ta bort',
    confirm: 'Bekräfta',
    cancel: 'Avbryt'
  },
  guide: {
    description: 'Guidesidan är användbar för personer som kom in i projektet för första gången. Du kan kort introducera projektets funktioner. Demo är baserat på ',
    button: 'Visa guide'
  },
  components: {
    documentation: 'Dokumentation',
    tinymceTips: 'Rik text är en kärnfunktion i administrationsbackend, men samtidigt är det en plats med många fallgropar. Under processen att välja rik text tog jag också många omvägar. De vanliga rika texterna på marknaden har i princip använts, och jag valde slutligen Tinymce. Se den mer detaljerade jämförelsen och introduktionen av rik text.',
    dropzoneTips: 'Eftersom mitt företag har speciella behov och måste ladda upp bilder till qiniu, så istället för en tredje part valde jag att kapsla in det själv. Det är mycket enkelt, du kan se den detaljerade koden i @/components/Dropzone.',
    stickyTips: 'När sidan rullas till den förinställda positionen kommer den att fastna överst.',
    backToTopTips1: 'När sidan rullas till den angivna positionen visas knappen Tillbaka till toppen i nedre högra hörnet',
    backToTopTips2: 'Du kan anpassa knappens stil, visa/dölja, höjd för utseende, höjd för retur. Om du behöver en textprompt kan du använda element-ui el-tooltip-element externt',
    imageUploadTips: 'Eftersom jag bara använde vue@1-versionen, och den är inte kompatibel med mockjs för tillfället, modifierade jag den själv, och om du ska använda den är det bättre att använda den officiella versionen.'
  },
  table: {
    dynamicTips1: 'Fast rubrik, sorterad efter rubrikordning',
    dynamicTips2: 'Inte fast rubrik, sorterad efter klickordning',
    dragTips1: 'Standardordning',
    dragTips2: 'Ordningen efter dragning',
    title: 'Titel',
    importance: 'Viktighet',
    type: 'Typ',
    remark: 'Anmärkning',
    search: 'Sök',
    add: 'Lägg till',
    export: 'Exportera',
    reviewer: 'granskare',
    id: 'ID',
    date: 'Datum',
    author: 'Författare',
    readings: 'Läsningar',
    status: 'Status',
    actions: 'Åtgärder',
    edit: 'Redigera',
    publish: 'Publicera',
    draft: 'Utkast',
    delete: 'Ta bort',
    cancel: 'Avbryt',
    confirm: 'Bekräfta'
  },
  example: {
    warning: 'Skapa och redigera sidor kan inte cachas av keep-alive eftersom keep-alive include för närvarande inte stöder cachning baserat på rutter, så det är för närvarande cachat baserat på komponentnamn. Om du vill uppnå en liknande cachningseffekt kan du använda en webbläsarcachningsschema som localStorage. Eller använd inte keep-alive include för att cacha alla sidor direkt. Se detaljer'
  },
  errorLog: {
    tips: 'Klicka på feluppslagsikonen i det övre högra hörnet',
    description: 'Nu är hanteringssystemen i princip formen av spa, det förbättrar användarupplevelsen, men det ökar också möjligheten för sidproblem, en liten försumlighet kan leda till att hela sidan låser sig. Lyckligtvis tillhandahåller Vue ett sätt att fånga hanteringsundantag, där du kan hantera fel eller rapportera undantag.',
    documentation: 'Dokumentintroduktion'
  },
  excel: {
    export: 'Exportera',
    selectedExport: 'Exportera markerade objekt',
    placeholder: 'Ange filnamnet (standard excel-lista)'
  },
  zip: {
    export: 'Exportera',
    placeholder: 'Ange filnamnet (standard fil)'
  },
  pdf: {
    tips: 'Här använder vi window.print() för att implementera funktionen att ladda ner PDF.'
  },
  theme: {
    change: 'Ändra tema',
    documentation: 'Temadokumentation',
    tips: 'Tips: Det skiljer sig från theme-pick i navbaren är två olika skinning-metoder, var och en med olika applikationsscenarier. Se dokumentationen för detaljer.'
  },
  tagsView: {
    refresh: 'Uppdatera',
    close: 'Stäng',
    closeOthers: 'Stäng andra',
    closeAll: 'Stäng alla'
  },
  settings: {
    title: 'Sidestilinställning',
    theme: 'Temafärg',
    tagsView: 'Öppna taggvy',
    fixedHeader: 'Fast rubrik',
    sidebarLogo: 'Sidopanelslogotyp'
  },
  language: {
    switchSuccess: 'Språkbyte lyckades'
  }
}