import Enum
import IO

1..1000
|> map(fn _ -> "#{random(0..1_000_000)},#{random(10..1000)}" end)
|> join("\n")
|> puts()