//
//  SearchSafariView.swift
//  memento_app
//
//  Created by 小林千紘 on 2021/09/26.
//

import SwiftUI
import SafariServices

struct SearchSafariView: UIViewControllerRepresentable {
    var url: URL
    func makeUIViewController(context: Context) -> SFSafariViewController {
        return SFSafariViewController(url: url)
    }
    func updateUIViewController(_ uiViewController: SFSafariViewController, context: Context) {
    }
}
