---
sidebarDepth: 3
---

# Editor de texto enriquecido

El editor de texto enriquecido es una parte fundamental del sistema de administración, pero al mismo tiempo es un lugar con muchos problemas. En el proceso de selección de textos ricos, también caminé muchos desvíos. Los editores de texto enriquecido comunes en el mercado se utilizan básicamente, y finalmente se eligió [Tinymce](https://github.com/tinymce/tinymce).

Aquí hay una breve introducción a las razones por las que se recomienda `tinymce`: `tinymce` es un veterano para hacer una compañía de texto enriquecido (aquí también se recomienda `ckeditor`, también es una compañía que ha estado haciendo texto enriquecido, la nueva versión es muy bueno), sus productos han superado la prueba del mercado y cuentan con documentación detallada y una rica configuración. Una de las claves para usar texto enriquecido es copiar el formato. Antes de usar un texto coreano rico `summernote`, me desperdició mucho tiempo, muy hostil. Pero el formato de `tinymce` es bastante bueno. También tiene una característica de valor agregado: es una pasta de poder, es extremadamente potente, soporta copiar todo desde Word o cualquier otro lugar. La extensibilidad también es crítica para el texto enriquecido. Uso `tinymce` para escribir varios complementos, los costos de aprendizaje y la facilidad de estudio son buenos y muy fáciles de expandir. El último punto es que la documentación es muy buena, básicamente desea obtener el elemento de configuración, tiene. Tinymce también admite la carga bajo demanda, puede personalizar los complementos a través de su página de compilación oficial.

Déjame analizar algunos de los otros textos ricos en el mercado:

- **[summernote](https://github.com/summernote/summernote)** Permítame comenzar con un texto enriquecido que definitivamente no recomendaría. Es inconsistente con muchos comportamientos predeterminados reconocidos entre otros. Y solo para el uso de una función de diálogo, importan el bootstrap, un grupo de personas protestan. El formateo también es muy malo. ¡No lo uses de todos modos! ¡No lo uses! ¡No lo uses!

- **[ckeditor](https://github.com/galetahub/ckeditor)** Ckeditor también es una empresa veterana que hace texto enriquecido, solía ​​usarlo en el proyecto de la empresa. Este año, la versión 5.0 de la interfaz de usuario también se ha vuelto más bonita, bastante buena y tiene los complementos más ricos. Se recomienda que lo intentes.

- **[quill](https://github.com/quilljs/quill)** También es un texto rico muy caliente, la piel es muy elegante. Escribir un plug-in basado en él también es muy simple. El diseño de la API es muy bueno. La razón por la que no lo elegí fue porque no era buena para la imagen de operación y era difícil de cambiar. Si no hay operación de la imagen del usuario, se recomienda.

- **[medium-_editor_](https://github.com/yabwe/medium-editor)** El famoso texto rico en medio (producido de forma no oficial), pero el grado de finalización no es muy bueno, la escalabilidad no es mala . Sin embargo, creo que la mayoría de los usuarios todavía no se utilizarán en esta forma de escritura.

- **[Squire](https://github.com/neilj/Squire)** Un texto enriquecido relativamente ligero, comprimido solo 11.5kb, en relación con otro texto enriquecido es muy pequeño, las características recomendadas no son una sugerencia complicada.

- **[UEditor](http://ueditor.baidu.com/website/index.html)** No se usa en profundidad, solo se usa un proyecto simple en angular1X, pero ui realmente feo, no cumple con la estética actual , el funcionario también ha pasado mucho tiempo sin ir con el nuevo.

- **[slate](https://github.com/ianstormtaylor/slate)** Un marco completamente personalizable para crear editores de texto enriquecido. Slate te permite crear editores ricos e intuitivos como los de Medium, Dropbox Paper o Google Docs, que se están convirtiendo en una mesa de apuestas para aplicaciones en la web, sin que tu base de código se vuelva más compleja. Se ve bien, después de una oportunidad practicaré en el proyecto, pruébalo.

Incluí una gran cantidad de texto enriquecido, pero no enumeré ningún texto enriquecido relacionado con vue, principalmente porque el texto enriquecido es realmente más complejo de lo que se pensaba. También dicho en el artículo anterior, de hecho, los componentes de encapsulación vue son muy convenientes, no hay necesidad de usar el paquete de cosas de otra persona.
Qué tipo de vue-quill vue-editor es solo un paquete simple, sin dificultad. También puedes encapsularlo tú mismo, y ser un poco más flexible y controlable. Además, vue realmente no tiene ningún texto enriquecido bueno, a diferencia de reaccionar tiene [draft](https://github.com/facebook/draft-js) producido por facebook, [editor](https://github.com/ory/editor) producido por ory. Vue no tiene este producto de una gran empresa.

Por supuesto, también puede elegir algún editor de texto enriquecido pagado, la propia compañía del autor tiene un proyecto en el uso del [froala-editor](https://www.froala.com/wysiwyg-editor). Si es hermoso y fácil de usar, la compañía compró una versión profesional, $ 349 al año, el precio también es muy razonable, pero de hecho, ahorrar el costo del desarrollo del desarrollador puede ir mucho más allá del precio.

## Tinymce

Aquí para hablar brevemente sobre el uso de Tinymce en sus propios proyectos.

After <Badge text="v4.2.0+"/> will dynamic import tinymce by `CDN` .

If you want to change the cdn address or the version of tinymce, just find tinymce cdn in [@/components/Tinymce](https://github.com/adempiere/adempiere-vue/blob/master/src/components/Tinymce/index.vue) then modified it. It will be automatically injected into `index.html` via `dynamicLoadScript`.

> El uso actual del método 'Tinymce' de la instalación de npm es más complejo y tiene algunos problemas (que pueden usarse en el futuro). :space_invader:

**Uso**
Debido a que el texto enriquecido no es adecuado para datos de dos vías, solo vea los cambios de contenido una vez, y luego no volverá a verse. Si más tarde necesita cambiar el contenido de texto enriquecido. Puede configurarse por `this.refs.xxx.setContent()`.

El código fuente también es muy simple, cualquier otra necesidad se puede modificar en `@/components/Tinymce/index.vue`.

```html
    <tinymce :height="300" v-model="content" id='tinymce'></tinymce>
```
