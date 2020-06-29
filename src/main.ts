import Container from './Application/DependencyInjection/Container';

console.log("-----------------------------------------------");
console.log("--- Creep Player loaded.                    ---");
console.log("-----------------------------------------------");

Container.directives.initialize();

export function loop(): void {
  Container.directives.run();
  Container.executor.run();
}
