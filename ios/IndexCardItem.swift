//
//  IndexCardItem.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/29.
//

import SwiftUI

struct IndexCardItem: View {
    let indexCard: IndexCardItemData

        init(indexCard: IndexCardItemData) {
            self.indexCard = indexCard
        }

    var body: some View {
        VStack{

            Text("Book Title")
                .foregroundColor(Color("my_purple_600"))
            Text(indexCard.booktitle)
            MyImageView(bookimage: indexCard.bookimage)
            Text(indexCard.author)

            Spacer()

            Text("Your Thought")
                .foregroundColor(Color("my_purple_600"))
            Text(indexCard.thoughts)

            HStack{
                Text(String(indexCard.page))
                Text("Page")
                    .foregroundColor(Color.yellow)
            }

            HStack{
                Text(String(indexCard.readingtime))
                Text("Minutes")
                    .foregroundColor(Color.yellow)
            }
        }
        .padding(15)
        .overlay(RoundedRectangle(cornerRadius: 20)
                    .stroke(Color.gray, lineWidth: 1)
        )
        .frame(width: 300, height: 400)
    }


}
