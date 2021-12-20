/**
 * Generated using theia-extension-generator
 */
import { MyextensionCommandContribution, MyextensionMenuContribution } from './myextension-contribution';
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { ContainerModule } from '@theia/core/shared/inversify';

export default new ContainerModule(bind => {
    // add your contribution bindings here
    bind(CommandContribution).to(MyextensionCommandContribution);
    bind(MenuContribution).to(MyextensionMenuContribution);
});
