package utils


import java.io.FileNotFoundException
import scala.io.Source


enum ReadFileErrors {
  case NOT_FOUND, UNKNOWN_ERR
}

def readFileAndReturnTheWholeFileContent(path: String): Either[String, ReadFileErrors]= {
  try {
    val fileContent = new StringBuilder("")
    val source = Source.fromFile(path)
    try {
      for (line <- source.getLines()) {
        fileContent ++= line + "\n"
      }
      Left(fileContent.toString())
    } finally {
      source.close() 
    }
  } catch {
    case _: FileNotFoundException =>
      Right(ReadFileErrors.NOT_FOUND)
    case ex: Exception =>
      Right(ReadFileErrors.UNKNOWN_ERR)
  }
}
