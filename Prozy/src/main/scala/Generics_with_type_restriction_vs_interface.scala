// Define a trait (similar to an interface in Java).
// Traits define a common contract that classes can implement.
trait Callable {
   def someMethod: String
}

// Define a class that implements the Callable trait.
// This class also introduces an additional method (`otherMethod`),
// which is not part of the trait.
class MyCallable extends Callable {
   override def someMethod: String = "Implemented someMethod"

   // This method is specific to `MyCallable` and is not in `Callable`
   def otherMethod: String = "Extra method in MyCallable"
}

// Function that accepts a parameter of type `Callable` explicitly
// Since the return type is `Callable`, we lose any subclass-specific methods.
def funcAcceptingInterface(v: Callable): Callable = {
   v  // Returning `v` as a `Callable`, restricting access to only trait methods
}

// Generic function that accepts any subtype `T` of `Callable`.
// The return type is `T`, meaning the original class type is preserved.
def funcWithConstrainedGeneric[T <: Callable](v: T): T = {
   v  // Returning `v` as `T`, so we retain its specific type
}

@main
def main(): Unit = {
   val obj = new MyCallable()

   // Using function that explicitly accepts `Callable`
   val result1 = funcAcceptingInterface(obj)
   println(result1.someMethod)  // ✅ Works because `someMethod` is in `Callable`

   // println(result1.otherMethod)  // ❌ ERROR: `otherMethod` is not in `Callable`
   // The object is now treated as a `Callable`, so we lose access to subclass methods.

   // Using function with generic type constraint
   val result2 = funcWithConstrainedGeneric(obj)
   println(result2.someMethod)  // ✅ Works because `someMethod` is in `Callable`
   println(result2.otherMethod) // ✅ Works because `result2` retains `MyCallable` type

   // Since the return type of `funcWithConstrainedGeneric` is `T`,
   // where `T` is the original type, we do not lose subclass methods.
}
