//
//  ImageView.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/29.
//

import SwiftUI

struct MyImageView: View {
    let bookimage: String
        func imagefunc() -> UIImage? {
            let imageUrl: URL = URL(string:  bookimage)!

               let imageData = try?Data(contentsOf: imageUrl)
            if imageData != nil {
                return UIImage(data: imageData!)?.withRenderingMode(.alwaysOriginal)
            }

            return nil
        }
    var body: some View {
        if imagefunc() != nil {
            Image(uiImage: imagefunc()!)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 100, height: 100)

        } else {
            Text("NO Image...")
        }
    }
}

struct ImageView_Previews: PreviewProvider {
    static var previews: some View {
        MyImageView(bookimage: "MyImage")
    }
}
