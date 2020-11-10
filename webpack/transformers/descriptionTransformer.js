/**
 * A typescript transformer that automatically generates description decorators from JSDoc tags.
 * 
 * When used, a description decorator will be generated for a property or method that:
 *  - has either the `@property`, `@event` or `@service` decorator applied to it
 *  - is declared in a class that has the `@TWWidgetDefinition` decorator applied to it
 * 
 * It will also generate a description decorator for any class that has the `@TWWidgetDefinition` decorator applied to it.
 * 
 * If a description decorator is already specified for an element, the transformer will skip creating an additional
 * description decorator for that element.
 * 
 * The transformer will take the text of the first JSDoc tag that refers to each matching element and 
 * supply it as the argument for the description decorator.
 */
class DescriptionTransformer {



    /**
     * Checks whether the given node has a decorator or decorator factory with the given name.
     * @param name      The name of the decorator to find.
     * @param node      The node in which to search.
     * @return          `true` if the decorator was found, `false` otherwise.
     */
    hasDecoratorNamed(name, node) {
        if (!node.decorators) return false;

        // Getting the decorator name depends on whether the decorator is applied directly or via a
        // decorator factory.
        for (const decorator of node.decorators) {
            
            // In a decorator factory, the decorator itself is the result of invoking
            // the decorator factory function so it doesn't technically have a name; in this case the name
            // of the decorator factory function is considered to be the decorator name.
            if (decorator.expression.kind == ts.SyntaxKind.CallExpression) {
                const callExpression = decorator.expression;
                if (callExpression.expression.getText() == name) {
                    return true;
                }
            }
            else if (decorator.expression.kind == ts.SyntaxKind.Identifier) {
                const identifierExpression = decorator.expression;
                if (identifierExpression.text == name) {
                    return true;
                }
            }
        }
        return false;
    }

}