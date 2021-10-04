//
//  SearchListView.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/30.
//

import SwiftUI

struct SearchListView: View {
    var bookSearchList: [BookSearchItem]
    var bookShopName: String

    @State var showSafari = false
    class ClickedUrl: ObservableObject {
        @Published var clickedUrl: URL? = nil
        static let instance = ClickedUrl()
        private init () {
        }
    }

    let instance = ClickedUrl.instance
    var body: some View {
        if bookSearchList.count == 0 {
            VStack{
                Text("No content...")
            }
        } else {
            VStack{
                Text(bookShopName)
        List(bookSearchList) {
            book in
            HStack(spacing: 10){

            Button(action: {
                instance.clickedUrl = book.itemUrl
                showSafari.toggle()
            }){
                HStack{
                    Image(uiImage: book.image)
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(height: 50)
                    Text(book.title)
                }
            }
            .buttonStyle(PlainButtonStyle())
            .sheet(isPresented: self.$showSafari, content: {
                SearchSafariView(url: instance.clickedUrl!)
                    .edgesIgnoringSafeArea(.bottom)
            })


                Spacer()


                NavigationLink(destination: CreateModalView(title: book.title, author: book.author, imageUrl: book.imageUrl,image: book.image)){
                        Image("pen_icon")
                                                    .resizable()
                                                    .frame(width: 50, height: 50, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
                    }
                    .frame(width: 30, height: 30, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)
                }
            .frame(height: 50, alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/)

            }
            }
    }
    }
}
