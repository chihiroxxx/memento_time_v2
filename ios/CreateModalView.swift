//
//  CreateModalView.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/27.
//

import SwiftUI


struct CreateModalView: View {
    @ObservedObject var auth = Auth.provider
    @ObservedObject var thoughtData = ThoughtData()

    var title: String
    var author: String?
    var imageUrl: URL?
    var image: UIImage?

    @State var inputThought = ""
    @State var inputPage = ""
    @State var inputReadingTime = ""
    @State var inputDate = Date()

    @State var thoughtInstance = Thought.init(booktitle: "", thoughts: "", date: Date())
    var body: some View {
        ScrollView(showsIndicators: false){

            VStack{
                VStack{
                    Text(title)
                    if imageUrl != nil {
                        Image(uiImage: image!)
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(width: 100,height: 120)

                    } else {
                        Text("NO Image...")
                    }
                }
                VStack{
                    Text("Thought")
                        .multilineTextAlignment(.leading)
                    TextEditor(text: $inputThought)
                        .frame(height: 120, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
                        .border(Color.gray)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .disableAutocorrection(true)
                    Text("Page")
                        .multilineTextAlignment(.leading)
                    TextField("ページ数", text: $inputPage)
//                        .frame(height: 100, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
                        .border(Color.gray)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .keyboardType(.numberPad)
                    Text("Reading Time")
                        .multilineTextAlignment(.leading)
                    TextField("読んだ時分（分単位）", text: $inputReadingTime)
//                        .frame(height: 100, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
                        .border(Color.gray)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .keyboardType(.numberPad)
                    Text("Time")
                        .multilineTextAlignment(.leading)
                    DatePicker("Date", selection: $inputDate)
                        .labelsHidden()
                        .environment(\.locale, Locale(identifier: "ja"))
                    Button(action: {
                        thoughtPostBackend()

                    }){
                        Text("SEND")
                    }
                }

            }

        }
    }
    func thoughtPostBackend() {
        thoughtInstance.booktitle = title
        thoughtInstance.author = author
        thoughtInstance.bookimage =  imageUrl?.absoluteString
        thoughtInstance.date = inputDate
        thoughtInstance.thoughts = inputThought
        thoughtInstance.page = inputPage
        thoughtInstance.readingtime = inputReadingTime
        thoughtData.thoughtCreateBackend(Thought: thoughtInstance)
        inputThought = ""
        inputPage = ""
        inputReadingTime = ""
    }

    }
