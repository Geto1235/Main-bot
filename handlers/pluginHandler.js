import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const plugins = [];
export const initPlugins = (pluginDir, sock) => {
  fs.readdirSync(pluginDir).forEach((file) => {
    const filePath = path.join(pluginDir, file);
    const fileUrl = pathToFileURL(filePath).href;
    import(fileUrl).then((plugin) => {
      plugins.push(plugin.default);
      console.log(`تجهيز هيكلية: ${plugin.default.name}`);    }).catch(err => {  console.error(`Failed to load plugin ${file}:`, err);     });
     fs.watch(filePath, (eventType) => {
      if (eventType === 'change') {
        import(`${fileUrl}?update=${Date.now()}`).then((updatedPlugin) => {
          const index = plugins.findIndex((p) => p.name === updatedPlugin.default.name);
          if (index !== -1) {
            plugins[index] = updatedPlugin.default;
            console.log(`Plugin updated: ${updatedPlugin.default.name}`);
          }
        }).catch(err => {
          console.error(`Failed to update plugin ${file}:`, err);
        });
      }
    });
  });
};
export const getPlugins = () => plugins;