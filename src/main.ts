import Container from './Application/DependencyInjection/Container';

console.log("-----------------------------------------------");
console.log("--- Creep Manager v0.1.0 loaded.            ---");
console.log("-----------------------------------------------");

export function loop(): void {
  Container.directives.run();
  Container.executor.run();
}
