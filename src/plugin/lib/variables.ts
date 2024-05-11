
declare type ExtraVariableBindableNodeField = 'fills'
export declare type TidyVariableFields = VariableBindableNodeField | ExtraVariableBindableNodeField

export const createVariableHandler = (types: VariableScope[], findClosestMatchFunction: Function) => {
    return {
        types,
        findClosestMatchFunction,
        async getVariables() {
            const localVariables = await figma.variables.getLocalVariablesAsync();
            return localVariables.filter((v) => this.types.some(type =>  v.scopes.includes(type)));
        },


        async bindVariables(selectedNode: SceneNode, properties: TidyVariableFields[]) {
            const variables = await this.getVariables();
            const boundVariables = selectedNode.boundVariables;

            properties.forEach((p) => {
                if (p === 'characters') {
                    return
                }
                if (isFrame(selectedNode)) {
                    const spacingMode = selectedNode.inferredAutoLayout ? selectedNode.inferredAutoLayout.primaryAxisAlignItems : false
                    if (spacingMode === 'SPACE_BETWEEN' && p === 'itemSpacing') {
                        return
                    }
                    const sameInferredVariable = selectedNode.inferredVariables![p];
                    if (sameInferredVariable) {
                        selectedNode.setBoundVariable(p as VariableBindableNodeField | VariableBindableTextField , sameInferredVariable[0] as unknown as Variable);
                    } else {
                        // TODO extend this to handle multiple mode, find the mode of the selected node and use that to index the right value
                        const variableValues = variables.map(v => Object.values(v.valuesByMode)[0]);
                        const startingValue = p === 'fills' ? getFillColor(selectedNode[p]) : selectedNode[p];
                        const closestMatchIndex = this.findClosestMatchFunction(variableValues, startingValue);
                        const matchingVariable = variables[closestMatchIndex];
                        if (p === 'fills') {
                            console.log(matchingVariable)
                            const fillsCopy = [...selectedNode.fills as Array<any>]
                            fillsCopy[0] = figma.variables.setBoundVariableForPaint(fillsCopy[0], 'color', matchingVariable)
                            selectedNode.fills = fillsCopy
                        } else {
                            selectedNode.setBoundVariable(p, matchingVariable);
                        }
                    }
                }

            });
        }
    };
}

export const isFrame = (node: SceneNode) : node is FrameNode => {
    return (node as FrameNode).inferredAutoLayout !== undefined;
}

const getFillColor = (fills: readonly Paint[] | PluginAPI['mixed']) => {
    const fillsCopy = [...fills as Array<any>]
    if (!fillsCopy[0]) {
        return;
    }
    if (fillsCopy[0].boundVariables.color.id !== null) {
        return;
    }

    return fillsCopy[0].color
}